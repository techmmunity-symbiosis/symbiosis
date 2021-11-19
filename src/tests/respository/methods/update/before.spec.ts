/* eslint-disable @typescript-eslint/naming-convention */
import { Column } from "../../../../lib/decorators/columns/column";
import { Entity } from "../../../../lib/decorators/entities/entity";
import { TestConnection } from "../../../constants/test-connection";
import { TestRepository } from "../../../constants/test-repository";
import { OneToMany } from "../../../../lib/decorators/relations/one-to-many";
import { PrimaryColumn } from "../../../../lib/decorators/columns/primary-column";

describe("Repository > Methods > beforeUpdate", () => {
	const id = "11cb020e-6dcb-4c51-93ed-a7a6abbfc771";

	describe("Simple entity", () => {
		@Entity()
		class TestEntity {
			@PrimaryColumn()
			public id: string;

			@Column()
			public foo: number;
		}

		let repository: TestRepository<TestEntity>;

		beforeAll(async () => {
			const connection = new TestConnection({
				entities: [TestEntity],
				namingStrategy: {
					column: "UPPER_CASE",
				},
			});
			await connection.load();

			repository = new TestRepository<TestEntity>(
				connection.entityManager,
				connection.logger,
				TestEntity,
			);
		});

		it("should auto-generate fields and convert to the database format", () => {
			const result = repository.beforeUpdate({
				conditions: {
					id,
				},
				data: {
					foo: 1,
				},
			});

			expect(result).toStrictEqual({
				conditions: {
					ID: id,
				},
				data: {
					FOO: 1,
				},
			});
		});

		it("should auto-generate fields and convert to the database format (array)", () => {
			const result = repository.beforeUpdate({
				conditions: [
					{
						id,
					},
					{
						foo: 2,
					},
				],
				data: {
					foo: 1,
				},
			});

			expect(result).toStrictEqual({
				conditions: [
					{
						ID: id,
					},
					{
						FOO: 2,
					},
				],
				data: {
					FOO: 1,
				},
			});
		});

		it("should do nothing with the options", () => {
			const result = repository.beforeUpdate({
				conditions: {
					id,
				},
				data: {
					foo: 1,
				},
				options: {
					retries: 3,
				},
			});

			expect(result).toStrictEqual({
				conditions: {
					ID: id,
				},
				data: {
					FOO: 1,
				},
				options: {
					retries: 3,
				},
			});
		});
	});

	describe("Entity with relations", () => {
		@Entity()
		class AnotherSubTestEntity {
			@PrimaryColumn()
			public id: string;

			@Column()
			public testId: string;
		}

		@Entity()
		class SubTestEntity {
			@PrimaryColumn()
			public id: string;

			@Column()
			public testId: string;
		}

		@Entity()
		class TestEntity {
			@PrimaryColumn()
			public id: string;

			@OneToMany({
				targetEntity: SubTestEntity,
				relationMap: {
					columnName: "id",
					targetColumnName: "testId",
				},
			})
			public subTest: Array<SubTestEntity>;

			@OneToMany({
				targetEntity: AnotherSubTestEntity,
				relationMap: {
					columnName: "id",
					targetColumnName: "testId",
				},
			})
			public anotherSubTest: Array<AnotherSubTestEntity>;
		}

		let repository: TestRepository<TestEntity>;

		beforeAll(async () => {
			const connection = new TestConnection({
				entities: [TestEntity, SubTestEntity, AnotherSubTestEntity],
				namingStrategy: {
					column: "UPPER_CASE",
				},
			});
			await connection.load();

			repository = new TestRepository<TestEntity>(
				connection.entityManager,
				connection.logger,
				TestEntity,
			);
		});

		it("should auto-generate fields and convert to the database format (one relation)", () => {
			const result = repository.beforeUpdate({
				conditions: {
					id,
				},
				data: {
					id: "foo",
					subTest: [
						{
							id: "bar",
						},
					],
				},
			});

			expect(result).toHaveProperty("data");
			expect(result.conditions).toStrictEqual({
				ID: id,
			});
			expect(result.data).toStrictEqual({
				ID: "foo",
			});
			expect(result.relations).toStrictEqual([
				{
					entity: SubTestEntity,
					data: {
						ID: "bar",
						TEST_ID: "foo",
					},
				},
			]);
		});

		it("should auto-generate fields and convert to the database format (multiple relations)", () => {
			const result = repository.beforeUpdate({
				conditions: {
					id,
				},
				data: {
					id: "foo",
					subTest: [
						{
							id: "bar",
						},
					],
					anotherSubTest: [
						{
							id: "xyz",
						},
					],
				},
			});

			expect(result).toHaveProperty("data");
			expect(result.conditions).toStrictEqual({
				ID: id,
			});
			expect(result.data).toStrictEqual({
				ID: "foo",
			});
			expect(result.relations).toStrictEqual([
				{
					entity: SubTestEntity,
					data: {
						ID: "bar",
						TEST_ID: "foo",
					},
				},
				{
					entity: AnotherSubTestEntity,
					data: {
						ID: "xyz",
						TEST_ID: "foo",
					},
				},
			]);
		});
	});
});
