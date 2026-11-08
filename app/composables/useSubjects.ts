import { storeToRefs } from "pinia";
import { useSubjectStore } from "~/stores/subjects";

export const useSubjects = () => {
  const store = useSubjectStore();
  const { subjects, loading, allSubjects, subjectCount } = storeToRefs(store);

  return {
    subjects,
    loading,
    allSubjects,
    subjectCount,
    load: store.load,
    add: store.add,
    update: store.update,
    remove: store.remove,
    getById: store.getById,
  };
};
