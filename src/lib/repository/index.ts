import { EntityManager } from "../entity-manager";
import { afterSave, AfterSaveParams } from "./methods/after-save";
import { afterInsert, AfterInsertParams } from "./methods/after-insert";
import { beforeSave, BeforeSaveParams } from "./methods/before-save";
import { beforeInsert, BeforeInsertParams } from "./methods/before-insert";
import { FindConditions } from "./queries/types/find-conditions";
import { FindOneOptions, FindOptions } from "./queries/types/find-options";
import { BaseQueryOptions } from "./queries/types/query-options";
import { beforeUpdate, BeforeUpdateParams } from "./methods/before-update";
import { afterUpdate, AfterUpdateParams } from "./methods/after-update";
import { AfterUpsertParams, afterUpsert } from "./methods/after-upsert";
import { BeforeUpsertParams, beforeUpsert } from "./methods/before-upsert";
import { AfterFindParams, afterFind } from "./methods/after-find";
import { BeforeFindParams, beforeFind } from "./methods/before-find";

export abstract class Repository<
	Entity,
	EntityExtraMetadata,
	ColumnExtraMetadata,
> {
	public constructor(
		private readonly entityManager: EntityManager<
			EntityExtraMetadata,
			ColumnExtraMetadata
		>,
		private readonly entity: Entity,
	) {}

	/**
	 * --------------------------------------------------
	 *
	 * Insert / Update
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Make an "upsert" operation based on the primary keys.
	 *
	 * This is an more performative way to make an "upsert",
	 * and most of the databases supports this method.
	 */
	public abstract save(
		data: BeforeSaveParams<Entity>["data"],
		options?: BeforeSaveParams<Entity>["options"],
	): Promise<Array<Entity> | Entity>;

	/**
	 * Inserts a record on the database and fail if it's already exist.
	 */
	public abstract insert(
		data: BeforeSaveParams<Entity>["data"],
		options?: BeforeSaveParams<Entity>["options"],
	): Promise<Array<Entity> | Entity>;

	/**
	 * Updates a record based on a query and fail if it's not exist.
	 */
	public abstract update(
		conditions: FindOneOptions<Entity>["where"],
		data: Partial<Entity>,
		options?: BaseQueryOptions,
	): Promise<Array<Entity> | Entity>;

	/**
	 * Make an "upsert" operation based on a query.
	 */
	public abstract upsert(
		conditions: FindOneOptions<Entity>["where"],
		data: Partial<Entity>,
		options?: BaseQueryOptions,
	): Promise<Array<Entity> | Entity>;

	/**
	 * --------------------------------------------------
	 *
	 * Find
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Find many records based on a query.
	 */
	public abstract find(
		conditions: FindOptions<Entity>,
		options?: BaseQueryOptions,
	): Promise<Array<Entity>>;

	/**
	 * Find one record based on a query.
	 */
	public abstract findOne(
		conditions: FindOneOptions<Entity>,
		options?: BaseQueryOptions,
	): Promise<Entity>;

	/**
	 * --------------------------------------------------
	 *
	 * Delete
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Delete a record based on a query condition.
	 */
	public abstract delete(
		where: FindConditions<Entity>,
		options?: BaseQueryOptions,
	): Promise<number>;

	/**
	 * Soft delete a record based on a query condition.
	 *
	 * **WARN:** To use this method, the entity must have
	 * a column decorated with `DeleteDateColumn`.
	 */
	public abstract softDelete(
		where: FindConditions<Entity>,
		options?: BaseQueryOptions,
	): Promise<number>;

	/**
	 * Recovers a record that was sof-deleted.
	 *
	 * **WARN:** To use this method, the entity must have
	 * a column decorated with `DeleteDateColumn`.
	 */
	public abstract recover(
		where: FindConditions<Entity>,
		options?: BaseQueryOptions,
	): Promise<number>;

	/**
	 * --------------------------------------------------
	 *
	 * Count
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Count the records returned by a query condition.
	 */
	public abstract count(
		where: FindConditions<Entity>,
		options?: BaseQueryOptions,
	): Promise<number>;

	/**
	 * Some databases, like PostgreSQL, have methods that allow
	 * you to make a count operation in a more performative way,
	 * but it's not very precise.
	 *
	 * This methods allow you to make a count operator, that
	 * in some cases can be imprecise, but is more performative
	 */
	public abstract performativeCount(
		where: FindConditions<Entity>,
		options?: BaseQueryOptions,
	): Promise<number>;

	/**
	 * --------------------------------------------------
	 *
	 * BEFORE & AFTER save
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Handles the data before the start of the function
	 *
	 * Does things like auto-generate values and format the
	 * data to the database format
	 */
	protected beforeSave(params: BeforeSaveParams<Entity>) {
		return beforeSave<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * Handles the data after the end of the function
	 *
	 * Does things like format the data to the entity format
	 */
	protected afterSave(params: AfterSaveParams) {
		return afterSave<EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * --------------------------------------------------
	 *
	 * BEFORE & AFTER insert
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Handles the data before the start of the function
	 *
	 * Does things like auto-generate values and format the
	 * data to the database format
	 */
	protected beforeInsert(params: BeforeInsertParams<Entity>) {
		return beforeInsert<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * Handles the data after the end of the function
	 *
	 * Does things like format the data to the entity format
	 */
	protected afterInsert(params: AfterInsertParams) {
		return afterInsert<EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * --------------------------------------------------
	 *
	 * BEFORE & AFTER update
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Handles the data before the start of the function
	 *
	 * Does things like auto-generate values and format the
	 * data to the database format
	 */
	protected beforeUpdate(params: BeforeUpdateParams<Entity>) {
		return beforeUpdate<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * Handles the data after the end of the function
	 *
	 * Does things like format the data to the entity format
	 */
	protected afterUpdate(params: AfterUpdateParams<Entity>) {
		return afterUpdate<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * --------------------------------------------------
	 *
	 * BEFORE & AFTER upsert
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Handles the data before the start of the function
	 *
	 * Does things like auto-generate values and format the
	 * data to the database format
	 */
	protected beforeUpsert(params: BeforeUpsertParams<Entity>) {
		return beforeUpsert<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * Handles the data after the end of the function
	 *
	 * Does things like format the data to the entity format
	 */
	protected afterUpsert(params: AfterUpsertParams<Entity>) {
		return afterUpsert<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * --------------------------------------------------
	 *
	 * BEFORE & AFTER find
	 *
	 * --------------------------------------------------
	 */

	/**
	 * Handles the data before the start of the function
	 *
	 * Does things like auto-generate values and format the
	 * data to the database format
	 */
	protected beforeFind(params: BeforeFindParams<Entity>) {
		return beforeFind<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}

	/**
	 * Handles the data after the end of the function
	 *
	 * Does things like format the data to the entity format
	 */
	protected afterFind(params: AfterFindParams<Entity>): Array<Entity> {
		return afterFind<Entity, EntityExtraMetadata, ColumnExtraMetadata>(
			{
				entity: this.entity,
				entityManager: this.entityManager,
			},
			params,
		);
	}
}
