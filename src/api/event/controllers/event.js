"use strict";

/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // Get logged in users
  async me(ctx) {
    try {
      // console.log(ctx.state.user);
      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest(null, [
          { messages: [{ id: "No authorization header was found" }] },
        ]);
      }
      // const data = await strapi.services.events.find({ user: user.id });
      // console.log("!!!!!!!!!!", user.id);
      const data = await strapi.db.query("api::event.event").findMany({
        where: { user: { id: user.id } },
        populate: {
          // image: true,
          // createdBy: true,
          user: true,
        },
      });

      // const data = await strapi.entityService.findMany("api::event.event", 1, {
      //   populate: { someRelation: true },
      // });

      // const data = await strapi
      //   .service("api::event.event")
      //   .find({ id: user.id });

      if (!data) {
        return ctx.notFound();
      }
      return await this.sanitizeOutput(data, ctx);
    } catch (error) {
      ctx.body = error;
    }
  },

  // Policy
  async create(ctx) {
    // console.log("!!!!!!!!!!", ctx.state);

    if (!ctx.state.user) {
      return;
    }

    const { id } = ctx.state.user; //ctx.state.user contains the current authenticated user
    const response = await super.create(ctx);
    const updatedResponse = await strapi.entityService.update(
      "api::event.event",
      response.data.id,
      { data: { user: id } }
    );
    return updatedResponse;
  },

  async update(ctx) {
    // console.log("!!!!!!!!!!", ctx.state);

    if (!ctx.state.user) {
      return;
    }
    var { id } = ctx.state.user;
    var [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: ctx.request.params.id,
        user: id,
      },
    });
    if (event) {
      const response = await super.update(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },

  async delete(ctx) {
    var { id } = ctx.state.user;
    var [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: ctx.request.params.id,
        user: id,
      },
    });
    if (event) {
      const response = await super.delete(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },
}));

// async find(ctx) {
//   // Calling the default core action
//   const { data, meta } = await super.find(ctx);

//   const query = strapi.db.query("api::event.event");

//   await Promise.all(
//     data.map(async (item, index) => {
//       const article = await query.findOne({
//         where: {
//           id: item.id,
//         },
//         populate: ["createdBy"],
//       });

//       data[index].attributes.createdBy = {
//         id: page.createdBy.id,
//         firstname: page.createdBy.firstname,
//         lastname: page.createdBy.lastname,
//       };
//     })
//   );

//   return { data, meta };
// },

// async find(ctx) {
//   const { id } = ctx.params;
//   const { query } = ctx;

//   const entity = await strapi.service("api::event.event").findOne(id, query);
//   const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

//   sanitizedEntity.createdBy = {
//     id: entity.createdBy.id,
//     email: entity.createdBy.email,
//   };

//   return this.transformResponse(sanitizedEntity);
// },

// async find(ctx) {
//   // Calling the default core action
//   const { data, meta } = await super.find(ctx);
//   const query = strapi.db.query("api::event.event");
//   await Promise.all(
//     data.map(async (item, index) => {
//       const foundItem = await query.findOne({
//         where: {
//           id: item.id,
//         },
//         populate: ["createdBy", "updatedBy"],
//       });

//       data[index].attributes.createdBy = {
//         id: foundItem.createdBy.id,
//         firstname: foundItem.createdBy.firstname,
//         lastname: foundItem.createdBy.lastname,
//       };
//       data[index].attributes.updatedBy = {
//         id: foundItem.updatedBy.id,
//         firstname: foundItem.updatedBy.firstname,
//         lastname: foundItem.updatedBy.lastname,
//       };
//     })
//   );
//   return { data, meta };
// },
