const db = require("../db");

class SiteModel {
  async getAllSites(
    userId,
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  ) {
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        s.site_id,
        s.name,
        s.description,
        s.settings,
        s.preview_url as preview,
        s.status,
        s.created_at as "createdAt",
        s.updated_at as "updatedAt",
        COUNT(*) OVER() as total_count
      FROM sites s
      WHERE s.user_id = $1
    `;

    const params = [userId];
    let paramIndex = 2;

    if (search) {
      query += ` AND s.name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const sortColumn = this.getSortColumn(sortBy);
    query += ` ORDER BY ${sortColumn} ${sortOrder === "asc" ? "ASC" : "DESC"}`;

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.execute(query, params);

    return {
      sites: result.rows.map((row) => ({
        site_id: row.site_id,
        name: row.name,
        description: row.description,
        preview: row.preview,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
      total: result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0,
      page,
      limit,
      hasMore: offset + result.rows.length < result.rows[0]?.total_count,
    };
  }

  async getSiteById(siteId, userId) {
    const result = await db.execute(
      `SELECT 
        site_id,
        name,
        description,
        settings,
        preview_url as preview,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
       FROM sites 
       WHERE site_id = $1 AND user_id = $2`,
      [siteId, userId],
    );

    return result.rows[0];
  }

  async createSite(userId, siteData) {
    const result = await db.execute(
      `INSERT INTO sites (
        user_id, 
        name, 
        description, 
        settings, 
        status
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        site_id,
        name,
        description,
        settings,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [
        userId,
        siteData.name || "Новый сайт",
        siteData.description || "",
        siteData.settings ||
          JSON.stringify({
            backgroundColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
            maxWidth: "1200px",
            margin: "0 auto",
          }),
        siteData.status || "draft",
      ],
    );

    return result.rows[0];
  }

  async updateSite(siteId, userId, siteData) {
    const result = await db.execute(
      `UPDATE sites 
       SET 
         name = COALESCE($3, name),
         description = COALESCE($4, description),
         settings = COALESCE($5, settings),
         status = COALESCE($6, status),
         updated_at = NOW()
       WHERE site_id = $1 AND user_id = $2
       RETURNING 
         site_id,
         name,
         description,
         settings,
         status,
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [
        siteId,
        userId,
        siteData.name,
        siteData.description,
        siteData.settings ? JSON.stringify(siteData.settings) : null,
        siteData.status,
      ],
    );

    return result.rows[0];
  }

  async deleteSite(siteId, userId) {
    const result = await db.execute(
      `DELETE FROM sites 
       WHERE site_id = $1 AND user_id = $2
       RETURNING site_id`,
      [siteId, userId],
    );

    return result.rows.length > 0;
  }

  async setPreview(siteId, userId, previewUrl) {
    const result = await db.execute(
      `UPDATE sites 
       SET preview_url = $3, updated_at = NOW()
       WHERE site_id = $1 AND user_id = $2
       RETURNING preview_url`,
      [siteId, userId, previewUrl],
    );

    return result.rows[0]?.preview_url;
  }

  getSortColumn(sortBy) {
    const sortColumns = {
      name: "name",
      createdAt: "created_at",
      updatedAt: "updated_at",
      status: "status",
    };

    return sortColumns[sortBy] || "created_at";
  }

  async addComponent(siteId, userId, componentData) {
    await this.verifySiteOwnership(siteId, userId);

    const maxOrderResult = await db.execute(
      "SELECT COALESCE(MAX(sort_order), 0) as max_order FROM site_components WHERE site_id = $1",
      [siteId],
    );

    const nextOrder = maxOrderResult.rows[0].max_order + 1;

    const result = await db.execute(
      `INSERT INTO site_components (
      site_id,
      type,
      props,
      sort_order
    ) VALUES ($1, $2, $3, $4)
    RETURNING 
      component_id as id,
      type,
      props,
      sort_order as "sortOrder"`,
      [
        siteId,
        componentData.type,
        JSON.stringify(componentData.props || {}),
        nextOrder,
      ],
    );

    return result.rows[0];
  }

  async updateComponent(componentId, siteId, userId, props) {
    await this.verifySiteOwnership(siteId, userId);

    const result = await db.execute(
      `UPDATE site_components 
     SET props = $1, updated_at = NOW()
     WHERE component_id = $2 AND site_id = $3
     RETURNING 
       component_id as id,
       type,
       props,
       sort_order as "sortOrder"`,
      [JSON.stringify(props), componentId, siteId],
    );

    return result.rows[0];
  }

  async getSiteComponents(siteId, userId) {
    const siteCheck = await db.query(
      "SELECT 1 FROM sites WHERE site_id = $1 AND user_id = $2",
      [siteId, userId],
    );

    if (siteCheck.rows.length === 0) {
      throw new Error("Site not found or access denied");
    }

    const result = await db.execute(
      `SELECT 
      component_id as id,
      type,
      props,
      sort_order as "sortOrder"
     FROM site_components 
     WHERE site_id = $1 
     ORDER BY sort_order, component_id`,
      [siteId],
    );

    return result.rows;
  }

  async deleteComponent(componentId, siteId, userId) {
    await this.verifySiteOwnership(siteId, userId);

    const result = await db.execute(
      `DELETE FROM site_components 
     WHERE component_id = $1 AND site_id = $2
     RETURNING component_id`,
      [componentId, siteId],
    );

    await this.renumberComponents(siteId);

    return result.rows.length > 0;
  }

  async updateComponentOrder(siteId, userId, componentsOrder) {
    await this.verifySiteOwnership(siteId, userId);

    await db.transaction(async (client) => {
      for (const [index, componentId] of componentsOrder.entries()) {
        await client.query(
          "UPDATE site_components SET sort_order = $1 WHERE component_id = $2 AND site_id = $3",
          [index, componentId, siteId],
        );
      }
    });
  }

  async verifySiteOwnership(siteId, userId) {
    const result = await db.execute(
      "SELECT 1 FROM sites WHERE site_id = $1 AND user_id = $2",
      [siteId, userId],
    );

    if (result.rows.length === 0) {
      throw new Error("Site not found or access denied");
    }
  }

  async renumberComponents(siteId) {
    const components = await db.execute(
      "SELECT component_id FROM site_components WHERE site_id = $1 ORDER BY sort_order, component_id",
      [siteId],
    );

    await db.transaction(async (client) => {
      for (const [index, row] of components.rows.entries()) {
        await client.query(
          "UPDATE site_components SET sort_order = $1 WHERE component_id = $2",
          [index, row.component_id],
        );
      }
    });
  }

  async getFullSite(siteId, userId) {
    const siteResult = await db.execute(
      `SELECT 
      site_id,
      name,
      description,
      settings,
      preview_url as preview,
      status,
      created_at as "createdAt",
      updated_at as "updatedAt"
     FROM sites 
     WHERE site_id = $1 AND user_id = $2`,
      [siteId, userId],
    );

    if (siteResult.rows.length === 0) {
      return null;
    }

    const site = siteResult.rows[0];

    const componentsResult = await db.execute(
      `SELECT 
      component_id as id,
      type,
      props,
      sort_order as "sortOrder"
     FROM site_components 
     WHERE site_id = $1 
     ORDER BY sort_order, component_id`,
      [siteId],
    );

    return {
      ...site,
      components: componentsResult.rows,
    };
  }
}
module.exports = new SiteModel();
