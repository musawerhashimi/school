// import { useState } from "react";
// import ProgramDetailModal from "./AcademicProgram/ProgramDetailModal";
// import type { Program } from "../../entities/program";

// export default function ProgramDetails() {
//   const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
//   return (
//     <ProgramDetailModal
//       program={selectedProgram}
//       onClose={() => setSelectedProgram(null)}
//     />
//   );
// }

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ProgramDetailModal from "./AcademicProgram/ProgramDetailModal";

export default function ProgramDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const program = location.state?.program;

  // Redirect if no program data
  useEffect(() => {
    if (!program) {
      navigate("/academic-programs"); // or wherever your programs list is
    }
  }, [program, navigate]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (!program) return null;

  return <ProgramDetailModal program={program} onClose={handleClose} />;
}
