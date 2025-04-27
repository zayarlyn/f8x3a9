import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import '@me/global.css'
import { GluestackUIProvider } from '@me/components/ui/gluestack-ui-provider'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@me/hooks/useColorScheme'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
	uri: 'http://localhost:5050/graphql',
	cache: new InMemoryCache(),
})

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	})

	const router = useRouter()
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()

			// router.push('/trips/1')
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return (
		<ApolloProvider client={client}>
			<GluestackUIProvider mode='light'>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack>
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen name='+not-found' />
					</Stack>
					<StatusBar style='auto' />
				</ThemeProvider>
			</GluestackUIProvider>
		</ApolloProvider>
	)
}
