export interface IModelInstance {
  data: IModelData;
  meta: IModelMeta;
}

export interface IModelData {
  [key: string]: any;
  _links?: IModelLinks;
}

export interface IModelLinks {
  [key: string]: string;
  self: string;
}

export interface IModelMeta {
  [key: string]: any;
  links?: IModelLinks;
}
