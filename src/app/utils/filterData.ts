import { FilterQuery, Model } from "mongoose";

interface IFilterData<T, I> {
  DocumentModel: Model<T>;
  query: Record<string, string | object>;
  searchableFields?: string[];
  searchInReference?: {
    fields: string[];
    ReferenceModel: Model<I>;
    referenceFields: string[];
  };
}

const FilterData = async <T, I>({
  DocumentModel,
  query,
  searchableFields,
  searchInReference,
}: IFilterData<T, I>) => {
  const {
    searchTerm = "",
    sort = "-createdAt",
    fields = "",
    page = "1",
    limit = "10",
    ...filter
  } = query;

  let finalQuery = { ...filter } as Record<string, string | object>;

  if (searchTerm && searchableFields?.length) {
    finalQuery = {
      $and: [
        filter,
        {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" },
          })),
        },
      ],
    };
  }

  if (searchInReference && searchTerm) {
    const { fields, ReferenceModel, referenceFields } = searchInReference;
    const referencedData = await ReferenceModel.find({
      $or: referenceFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })) as FilterQuery<I>[],
    });
    const newQuery = {
      $or: referencedData.map((ref) => ({
        $or: fields.map((field) => ({
          [field]: ref._id,
        })),
      })),
    };

    if (finalQuery["$and"]) {
      finalQuery["$and"] = [...(finalQuery["$and"] as []), newQuery];
    } else {
      finalQuery["$and"] = [newQuery];
    }
  }

  const filtered = DocumentModel.find(finalQuery)
    .sort(sort as string)
    .select((fields as string).split(",").join(" "))
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await DocumentModel.countDocuments(finalQuery);

  return {
    data: filtered,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
  };
};

export default FilterData;
