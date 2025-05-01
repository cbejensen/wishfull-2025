import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/auth": {};
  "/dashboard": {};
  "/friends": {};
  "/users/:id": {
    "id": string;
  };
};