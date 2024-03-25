import {
  type InsertableTaxonomyRow,
  type UpdateableTaxonomyRow,
  createTaxonomyCrudRepository,
  findSystemTaxonomies as findSystemTaxonomiesRepo,
  getTaxonomyBySlug as getTaxonomyBySlugRepo,
} from "@publiz/sqldb";
import { Container } from "../container";

type CreateTaxonomyInput = InsertableTaxonomyRow;

export const createTaxonomy = async (
  container: Container,
  input: CreateTaxonomyInput
) => createTaxonomyCrudRepository(container.sqlDb).create(input);

type UpdateTaxonomyInput = UpdateableTaxonomyRow;

export const updateTaxonomy = async (
  container: Container,
  id: number,
  input: UpdateTaxonomyInput
) => createTaxonomyCrudRepository(container.sqlDb).update(id, input);

export const getTaxonomyById = async (
  container: Container,
  idOrSlug: number | string
) => {
  if (Number.isInteger(Number(idOrSlug))) {
    return createTaxonomyCrudRepository(container.sqlDb).findById(+idOrSlug);
  }
  return getTaxonomyBySlugRepo(container.sqlDb, idOrSlug + "");
};

export const deleteTaxonomyById = async (container: Container, id: number) =>
  createTaxonomyCrudRepository(container.sqlDb).delete(id);

export const findSystemTaxonomies = async (container: Container) =>
  findSystemTaxonomiesRepo(container.sqlDb);

export const findTaxonomiesByIds = async (
  container: Container,
  ids: number[]
) => createTaxonomyCrudRepository(container.sqlDb).findByIds(ids);
