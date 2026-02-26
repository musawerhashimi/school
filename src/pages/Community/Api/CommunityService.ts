import type { MultiLangText } from "@/entities/CommunitySupport";
import type { CharityEvent } from "@/entities/Charityeventstypes";
import apiClient from "../../../lib/api";

// Community Partner Interface for API response
export interface CommunityPartner {
  id: number;
  logo: string;
  name: MultiLangText;
  description: MultiLangText;
  collaboration: MultiLangText;
  website?: string;
}

// Charity Events API Response Interface
export interface CharityEventsResponse {
  events: CharityEvent[];
  upcoming: CharityEvent[];
  past: CharityEvent[];
}

// Handle paginated response type (common in DRF)
interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
}

// Community Service
export const communityService = {
  // Get all community partners
  getCommunityPartners: () =>
    apiClient.get<PaginatedResponse<CommunityPartner> | CommunityPartner[]>(
      "/cms/community-partners/",
    ),

  // Get all charity events
  getCharityEvents: () => apiClient.get<CharityEventsResponse>("/cms/charity/"),
};

export default communityService;
