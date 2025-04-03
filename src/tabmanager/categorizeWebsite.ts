import {Category , categoryKeywords} from "./categoryTypes"

//categorize websites based on metadata
export function categorizeWebsite(metadata: string): Category {
  const lowercasedMetadata = metadata.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (
      keywords.some((keyword) =>
        lowercasedMetadata.includes(keyword.toLowerCase())
      )
    ) {
      return category as Category;
    }
    return "Other";
  }
  return "Other"
}
