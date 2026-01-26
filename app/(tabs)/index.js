import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { EntryForm } from "../../src/components/features/EntryForm";
import { useEntriesContext, useUnitPreferenceContext } from "../../src/context";

export default function NewEntryScreen() {
  const { addEntry } = useEntriesContext();
  const { unit, setUnit } = useUnitPreferenceContext();

  return (
    <ScreenWrapper>
      <EntryForm unit={unit} setUnit={setUnit} onSubmit={addEntry} />
    </ScreenWrapper>
  );
}
