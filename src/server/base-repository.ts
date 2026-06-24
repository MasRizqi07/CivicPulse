import db from "./db";
import type { Prisma } from "@prisma/client";

export abstract class BaseRepository<T, CreateInput, UpdateInput, WhereInput, WhereUniqueInput, Include, OrderBy> {
  protected abstract model: keyof typeof db;

  /**
   * Helper to add deletedAt filter to where clauses
   */
  protected withSoftDelete(where: any = {}): any {
    return {
      ...where,
      deletedAt: null,
    };
  }

  async create(data: CreateInput, include?: Include): Promise<T> {
    return (db[this.model] as any).create({
      data,
      include,
    });
  }

  async findById(id: string, include?: Include, includeDeleted = false): Promise<T | null> {
    const where = includeDeleted ? { id } : this.withSoftDelete({ id });
    return (db[this.model] as any).findUnique({
      where: where as WhereUniqueInput,
      include,
    });
  }

  async findOne(where: WhereInput, include?: Include, includeDeleted = false): Promise<T | null> {
    const finalWhere = includeDeleted ? where : this.withSoftDelete(where);
    return (db[this.model] as any).findFirst({
      where: finalWhere,
      include,
    });
  }

  async findAll(
    where?: WhereInput,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: OrderBy;
      include?: Include;
    },
    includeDeleted = false
  ): Promise<T[]> {
    const finalWhere = includeDeleted ? where : this.withSoftDelete(where);
    return (db[this.model] as any).findMany({
      where: finalWhere,
      ...options,
    });
  }

  async count(where?: WhereInput, includeDeleted = false): Promise<number> {
    const finalWhere = includeDeleted ? where : this.withSoftDelete(where);
    return (db[this.model] as any).count({ where: finalWhere });
  }

  async update(id: string, data: UpdateInput, include?: Include): Promise<T> {
    return (db[this.model] as any).update({
      where: { id } as WhereUniqueInput,
      data,
      include,
    });
  }

  async delete(id: string, include?: Include): Promise<T> {
    return (db[this.model] as any).update({
      where: { id } as WhereUniqueInput,
      data: { deletedAt: new Date() },
      include,
    });
  }

  async hardDelete(id: string): Promise<T> {
    return (db[this.model] as any).delete({
      where: { id } as WhereUniqueInput,
    });
  }
}
