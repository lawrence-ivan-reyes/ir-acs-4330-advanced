import { gql } from '@apollo/client'

export const ME = gql`
  query Me {
    me {
      id
      email
      role
    }
  }
`

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      plants {
        id
        name
      }
    }
  }
`

export const GET_PLANT = gql`
  query GetPlant($id: ID!) {
    plant(id: $id) {
      id
      name
      species
      lastWatered
      room {
        name
        sunlight
      }
      createdBy {
        id
      }
      careEvents {
        id
        kind
        note
        at
      }
    }
  }
`

export const ADD_PLANT = gql`
  mutation AddPlant($name: String!, $species: String, $roomId: ID!) {
    addPlant(name: $name, species: $species, roomId: $roomId) {
      id
      name
    }
  }
`

export const ADD_CARE_EVENT = gql`
  mutation AddCareEvent($plantId: ID!, $kind: CareKind!) {
    addCareEvent(plantId: $plantId, kind: $kind) {
      id
      kind
      note
      at
    }
  }
`

export const DELETE_PLANT = gql`
  mutation DeletePlant($id: ID!) {
    deletePlant(id: $id)
  }
`

export const NEW_EVENT = gql`
  fragment NewEvent on CareEvent {
    id
    kind
    note
    at
  }
`
