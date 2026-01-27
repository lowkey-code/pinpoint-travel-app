import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("settings", "routes/settings.tsx"),
  ...prefix("itinerary", [
    layout("routes/itinerary/layout.tsx", [
      index("routes/itinerary/_index.tsx"),
      route(":tripId", "routes/itinerary/$tripId/_index.tsx"),
      route(":tripId/day/:date", "routes/itinerary/$tripId/day/$date.tsx"),
      route(":tripId/grid", "routes/itinerary/$tripId/grid.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
