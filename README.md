# errors-as-data

When designing APIs to mutate data it is usually better to be explicit about the ways that calls can fail. The two main causes of failure are validation errors and precondition failures. This plugin handles the latter.

## Motivation

Given the following graphQL api:
```graphql
type Mutation {
    createUser(input: CreateUserInput!): User!
}
type CreateUserInput {
    username: String!
    email: String!
}
```

A user of this API must guess what preconditions must be met in order for the mutation to succeed. For example, the user may assume that the username must be unique and the email must be unique, but there is no way to know for sure from the schema alone. If the user attempts to create a user with a username that already exists, the server may respond with a generic error message or throw an exception.

Being explicit about precondition failures in the schema itself allows API consumers to enumerate all possible failure modes and handle them appropriately.

For example:
```graphql
type Mutation {
    createUser(input: CreateUserInput!): CreateUserPayload!
}
type CreateUserInput {
    username: String!
    email: String!
}
type CreateUserPayload {
    result: UserResult!
}
type UserResult = User | UsernameConflict | EmailConflict
type UsernameConflict {
    message: String!
}
type EmailConflict {
    message: String!
}
```

## Installation

```bash
npm install --save errors-as-data-plugin
```

```typescript
import { ErrorsAsDataPlugin } from "errors-as-data-plugin";

const preset: GraphileConfig.Preset = {
  // ...

  plugins: [
    ErrorsAsDataPlugin
  ],

  // ...
};
```

## Packaging

```bash
npm run build
# Optionally test locally
npm pack
# Publish
npm publish
```
