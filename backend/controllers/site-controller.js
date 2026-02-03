const ApiError = require("../error/ApiError");
const siteModel = require("../models/site-model");

class SiteController {
  async getSites(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await siteModel.getAllSites(
        userId,
        parseInt(page),
        parseInt(limit),
        search,
        sortBy,
        sortOrder,
      );

      return res.json(result);
    } catch (error) {
      console.error("Error getting sites:", error);
      return next(ApiError.internal("Ошибка при получении сайтов"));
    }
  }

  async getSite(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const site = await siteModel.getSiteById(id, userId);

      if (!site) {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return res.json(site);
    } catch (error) {
      console.error("Error getting site:", error);
      return next(ApiError.internal("Ошибка при получении сайта"));
    }
  }

  async createSite(req, res, next) {
    try {
      const userId = req.user.id;
      const siteData = req.body;

      if (!siteData.name || siteData.name.trim().length < 1) {
        return next(ApiError.badRequest("Название сайта обязательно"));
      }

      if (siteData.name.length > 100) {
        return next(
          ApiError.badRequest(
            "Название сайта не должно превышать 100 символов",
          ),
        );
      }

      const site = await siteModel.createSite(userId, siteData);

      return res.status(201).json(site);
    } catch (error) {
      console.error("Error creating site:", error);
      return next(ApiError.internal("Ошибка при создании сайта"));
    }
  }

  async updateSite(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const siteData = req.body;

      const site = await siteModel.updateSite(id, userId, siteData);

      if (!site) {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return res.json(site);
    } catch (error) {
      console.error("Error updating site:", error);
      return next(ApiError.internal("Ошибка при обновлении сайта"));
    }
  }

  async deleteSite(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await siteModel.deleteSite(id, userId);

      if (!deleted) {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return res.json({ success: true, message: "Сайт успешно удален" });
    } catch (error) {
      console.error("Error deleting site:", error);
      return next(ApiError.internal("Ошибка при удалении сайта"));
    }
  }

  async setPreview(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { previewUrl } = req.body;

      if (!previewUrl) {
        return next(ApiError.badRequest("URL превью обязателен"));
      }

      const preview = await siteModel.setPreview(id, userId, previewUrl);

      if (!preview) {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return res.json({ previewUrl: preview });
    } catch (error) {
      console.error("Error setting preview:", error);
      return next(ApiError.internal("Ошибка при установке превью"));
    }
  }

  async getFullSite(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const site = await siteModel.getFullSite(id, userId);

      if (!site) {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return res.json(site);
    } catch (error) {
      console.error("Error getting full site:", error);
      return next(ApiError.internal("Ошибка при получении сайта"));
    }
  }

  async addComponent(req, res, next) {
    try {
      const userId = req.user.id;
      const { siteId } = req.params;
      const componentData = req.body;

      if (!componentData.type) {
        return next(ApiError.badRequest("Тип компонента обязателен"));
      }

      const component = await siteModel.addComponent(
        siteId,
        userId,
        componentData,
      );

      return res.status(201).json(component);
    } catch (error) {
      console.error("Error adding component:", error);

      if (error.message === "Site not found or access denied") {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return next(ApiError.internal("Ошибка при добавлении компонента"));
    }
  }

  async updateComponent(req, res, next) {
    try {
      const userId = req.user.id;
      const { siteId, componentId } = req.params;
      const { props } = req.body;

      if (!props) {
        return next(ApiError.badRequest("Свойства компонента обязательны"));
      }

      const component = await siteModel.updateComponent(
        componentId,
        siteId,
        userId,
        props,
      );

      if (!component) {
        return next(ApiError.notFound("Компонент не найден"));
      }

      return res.json(component);
    } catch (error) {
      console.error("Error updating component:", error);

      if (error.message === "Site not found or access denied") {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return next(ApiError.internal("Ошибка при обновлении компонента"));
    }
  }

  async deleteComponent(req, res, next) {
    try {
      const userId = req.user.id;
      const { siteId, componentId } = req.params;

      const deleted = await siteModel.deleteComponent(
        componentId,
        siteId,
        userId,
      );

      if (!deleted) {
        return next(ApiError.notFound("Компонент не найден"));
      }

      return res.json({ success: true, message: "Компонент успешно удален" });
    } catch (error) {
      console.error("Error deleting component:", error);

      if (error.message === "Site not found or access denied") {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return next(ApiError.internal("Ошибка при удалении компонента"));
    }
  }

  async updateComponentsOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const { siteId } = req.params;
      const { order } = req.body;

      if (!Array.isArray(order)) {
        return next(
          ApiError.badRequest("Порядок компонентов должен быть массивом"),
        );
      }

      await siteModel.updateComponentOrder(siteId, userId, order);

      return res.json({
        success: true,
        message: "Порядок компонентов обновлен",
      });
    } catch (error) {
      console.error("Error updating components order:", error);

      if (error.message === "Site not found or access denied") {
        return next(ApiError.notFound("Сайт не найден"));
      }

      return next(
        ApiError.internal("Ошибка при обновлении порядка компонентов"),
      );
    }
  }
}

module.exports = new SiteController();
