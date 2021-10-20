import { PreDefinedAutoGenerationMethods } from "../../entity-manager/types/column-metadata";
import { MetadataType } from "../../entity-manager/types/metadata-type";

export interface BaseColumnOptions<ColumnExtraMetadata = any> {
	name?: string;
	comment?: string;
	databaseType?: string;
	extras?: ColumnExtraMetadata;
}

export interface ColumnOptions<ColumnExtraMetadata = any>
	extends BaseColumnOptions<ColumnExtraMetadata> {
	defaultValue?: any;
	enum?: any;
	type?: MetadataType;
}

export type PrimaryColumnOptions<ColumnExtraMetadata = any> =
	BaseColumnOptions<ColumnExtraMetadata>;

export interface PrimaryGeneratedColumnOptions<ColumnExtraMetadata = any>
	extends BaseColumnOptions<ColumnExtraMetadata> {
	strategy?: PreDefinedAutoGenerationMethods;
}

export type DateColumnOptions<ColumnExtraMetadata = any> =
	BaseColumnOptions<ColumnExtraMetadata>;
