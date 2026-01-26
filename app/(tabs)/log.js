import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { LogView } from "../../src/components/features/log/LogView";
import { useEntriesContext, useUnitPreferenceContext } from "../../src/context";

export default function LogScreen() {
  const { entries, clearEntries } = useEntriesContext();
  const { unit } = useUnitPreferenceContext();

  return (
    <ScreenWrapper>
      <LogView entries={entries} unit={unit} onClearLog={clearEntries} />
    </ScreenWrapper>
  );
}
