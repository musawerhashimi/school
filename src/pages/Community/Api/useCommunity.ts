import { useQuery } from "@tanstack/react-query";
import {
  communityService,
  type CharityEventsResponse,
} from "./CommunityService";
import type { CommunityPartner } from "./CommunityService";
import type { CharityEvent } from "@/entities/Charityeventstypes";

// Helper to extract partners from response (handles both paginated and non-paginated)
const extractPartnersData = (
  data: CommunityPartner[] | { results?: CommunityPartner[] },
): CommunityPartner[] => {
  if (Array.isArray(data)) {
    return data;
  }
  // Handle paginated response from DRF
  if (data && typeof data === "object" && "results" in data) {
    return data.results || [];
  }
  return [];
};

// Hook to get community partners
export const useCommunityPartners = () => {
  return useQuery<CommunityPartner[], Error>({
    queryKey: ["community-partners"],
    queryFn: async () => {
      const response = await communityService.getCommunityPartners();
      // Handle both paginated and non-paginated responses
      return extractPartnersData(response.data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Filter type for charity events
export type CharityEventFilter = "all" | "upcoming" | "past";

// Hook to get charity events with filtering
export const useCharityEvents = (filter: CharityEventFilter = "all") => {
  return useQuery<CharityEvent[], Error>({
    queryKey: ["charity-events", filter],
    queryFn: async () => {
      const response = await communityService.getCharityEvents();
      const data: CharityEventsResponse = response.data;

      // Return filtered events based on filter type
      switch (filter) {
        case "upcoming":
          return data.upcoming;
        case "past":
          return data.past;
        case "all":
        default:
          return data.events;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get all charity events data (for counts)
export const useCharityEventsData = () => {
  return useQuery<CharityEventsResponse, Error>({
    queryKey: ["charity-events-data"],
    queryFn: async () => {
      const response = await communityService.getCharityEvents();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export default useCommunityPartners;
