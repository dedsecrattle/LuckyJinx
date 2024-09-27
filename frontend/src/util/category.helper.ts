export const stringifyCategories = (categories: String[]): string => {
  return categories.map((s) => s.trim()).join(";");
};

export const parseCategories = (categoriesString: string): String[] => {
  return categoriesString.split(";").map((s) => s.trim());
};
