import { Column } from "../../../lib/decorators/column";
import { Entity } from "../../../lib/decorators/entity/entity";
import { PrimaryGeneratedColumn } from "../../../lib/decorators/primary-generated-column";
import { MoreThan } from "../../../lib/repository/queries/find-operators/more-than";
import { TestConnection } from "../../constants/test-connection";
import { TestRepository } from "../../constants/test-repository";

describe("Repository > Methods > beforeFind", () => {
	@Entity()
	class TestEntity {
		@PrimaryGeneratedColumn("uuid")
		public id: string;

		@Column()
		public foo: number;
	}

	let repository: TestRepository<any>;

	beforeAll(() => {
		const connection = new TestConnection({
			entities: [TestEntity],
			namingStrategy: {
				column: "UPPER_CASE",
			},
		});

		repository = new TestRepository(connection.entityManager, TestEntity);
	});

	it("should do nothing if no where is specified", () => {
		const result = repository.beforeFind({
			conditions: {},
		});

		expect(result).toStrictEqual({
			conditions: {},
			options: undefined,
		});
	});

	it("should convert to the database format", () => {
		const result = repository.beforeFind({
			conditions: {
				where: {
					foo: 1,
				},
			},
		});

		expect(result).toStrictEqual({
			conditions: {
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					FOO: 1,
				},
			},
			options: undefined,
		});
	});

	it("should convert to the database format (with find operators)", () => {
		const result = repository.beforeFind({
			conditions: {
				where: {
					foo: MoreThan(1),
				},
			},
		});

		expect(result).toStrictEqual({
			conditions: {
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					FOO: MoreThan(1),
				},
			},
			options: undefined,
		});
	});

	it("should auto-generate fields and convert to the database format (array)", () => {
		const result = repository.beforeFind({
			conditions: {
				where: [
					{
						foo: 1,
					},
				],
			},
		});

		expect(result).toStrictEqual({
			conditions: {
				where: [
					{
						// eslint-disable-next-line @typescript-eslint/naming-convention
						FOO: 1,
					},
				],
			},
			options: undefined,
		});
	});

	it("should auto-generate fields and convert to the database format (array with find operators)", () => {
		const result = repository.beforeFind({
			conditions: {
				where: [
					{
						foo: MoreThan(1),
					},
				],
			},
		});

		expect(result).toStrictEqual({
			conditions: {
				where: [
					{
						// eslint-disable-next-line @typescript-eslint/naming-convention
						FOO: MoreThan(1),
					},
				],
			},
			options: undefined,
		});
	});
});
