Component Design

Keep components small and focused — single responsibility principle
Prefer functional components with hooks over class components
Lift state up only as high as necessary; avoid prop drilling with Context or state management libraries when needed

State & Data Flow

Minimize state — derive values when possible instead of storing redundant state
Colocate state near where it's used
Use useMemo/useCallback judiciously — profile first, don't prematurely optimize

Code Organization

Custom hooks for reusable logic (e.g., useForm, useFetch)
Consistent file structure — group by feature or type, just be consistent
Keep JSX readable — extract complex conditionals into variables or helper functions

Performance

Key props correctly in lists (stable, unique identifiers, not array indices)
Lazy load components/routes with React.lazy() and Suspense
Avoid inline object/function definitions in JSX when they cause unnecessary re-renders