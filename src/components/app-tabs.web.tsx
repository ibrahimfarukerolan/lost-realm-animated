import {
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native';

import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs
} from 'expo-router/ui';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />

      <TabList>
        <TabTrigger name="index" href="/">
          <TabButton>Home</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = Omit<PressableProps, 'ref'>;

function TabButton({
  children,
  ...props
}: TabButtonProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) =>
        pressed ? styles.pressed : undefined
      }
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
