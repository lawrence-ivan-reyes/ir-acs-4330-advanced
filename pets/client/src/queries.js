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

export const GET_PETS = gql`
  query GetPets {
    pets {
      id
      name
      species
      createdBy {
        id
      }
    }
  }
`

export const ADD_PET = gql`
  mutation AddPet($name: String!, $species: String!) {
    addPet(name: $name, species: $species) {
      id
      name
      species
      createdBy {
        id
      }
    }
  }
`

export const UPDATE_PET = gql`
  mutation UpdatePet($id: ID!, $name: String) {
    updatePet(id: $id, name: $name) {
      id
      name
    }
  }
`

export const DELETE_PET = gql`
  mutation DeletePet($id: ID!) {
    deletePet(id: $id)
  }
`

export const NEW_PET = gql`
  fragment NewPet on Pet {
    id
    name
    species
    createdBy {
      id
    }
  }
`
