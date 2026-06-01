export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = ["name", "brand", "tags"]) {
    if (this.queryString.search) {
      const regex = { $regex: this.queryString.search, $options: "i" };
      this.query = this.query.find({ $or: fields.map((field) => ({ [field]: regex })) });
    }
    return this;
  }

  filter() {
    const q = this.queryString;
    const filter = {};
    if (q.category) filter.category = q.category;
    if (q.brand) filter.brand = q.brand;
    if (q.isZivvoAssured) filter.isZivvoAssured = q.isZivvoAssured === "true";
    if (q.minPrice || q.maxPrice) filter.price = { ...(q.minPrice && { $gte: Number(q.minPrice) }), ...(q.maxPrice && { $lte: Number(q.maxPrice) }) };
    if (q.rating) filter["ratings.average"] = { $gte: Number(q.rating) };
    this.query = this.query.find(filter);
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort || "newest";
    const sortMap = {
      "price-low": "price",
      "price-high": "-price",
      rating: "-ratings.average",
      sold: "-sold",
      newest: "-createdAt"
    };
    this.query = this.query.sort(sortMap[sortBy] || "-createdAt");
    return this;
  }

  paginate(page = 1, limit = 12) {
    const skip = (Number(page) - 1) * Number(limit);
    this.query = this.query.skip(skip).limit(Number(limit));
    return this;
  }
}

