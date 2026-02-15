import { useQuery } from "@tanstack/react-query";
import { AboutService } from "./AboutService";

export const useAbout = () => {
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: AboutService.getDepartments,
  });

  const {
    data: team = { departments: [], members: [] },
    isLoading: isTeamLoading,
    error: teamError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: AboutService.getTeam,
  });

  const {
    data: teamMembers,
    isLoading: isTeamMembersLoading,
    error: teamMembersError,
  } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: AboutService.getTeamMembers,
  });

  return {
    departments,
    team,
    teamMembers,
    isLoading: isDepartmentsLoading || isTeamLoading || isTeamMembersLoading,
    error: departmentsError || teamError || teamMembersError,
  };
};

export const useTeamMember = (id: number) => {
  const {
    data: teamMember,
    isLoading: isTeamMemberLoading,
    error: teamMemberError,
  } = useQuery({
    queryKey: ["teamMember", id],
    queryFn: () => AboutService.getTeamMemberDetails(id),
    enabled: id > 0,
  });

  return {
    teamMember,
    isLoading: isTeamMemberLoading,
    error: teamMemberError,
  };
};
