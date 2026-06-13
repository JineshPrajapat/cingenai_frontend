import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProjects } from "../features/projects/projectsSlice";

export const useProjects = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.projects);

  useEffect(() => {
    if (!state.items.length) {
      dispatch(fetchProjects());
    }
  }, []);

  return state;
};