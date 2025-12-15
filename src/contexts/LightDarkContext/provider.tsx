export function LightDarkProvider({ children }: { children: React.ReactNode }) {
  const [mode, _setMode] = useState<Mode>(
    localStorage.getItem('mode') === 'dark' ? 'dark' : 'light'
  )
  const setMode = (newMode: Mode) => {
    _setMode(newMode)
    localStorage.setItem('mode', newMode)
  }

  const theme = useTheme(mode)
  const value = useMemo(() => ({ mode, setMode }), [mode])

  return (
    <LightDarkContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LightDarkContext.Provider>
  )
}
