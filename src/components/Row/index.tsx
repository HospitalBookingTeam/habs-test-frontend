import { createStyles, Grid, Text, useMantineTheme } from '@mantine/core'

const useStyles = createStyles((theme) => ({
	label: {
		color: theme.colors.dark,
		fontWeight: 500,
	},
}))

const RowWithLabel = ({
	label,
	content,
	labelSpan = 3,
	isOdd = false,
	fullWidth = true,
}: {
	label: string
	content?: string
	labelSpan?: number
	isOdd?: boolean
	fullWidth?: boolean
}) => {
	const { classes } = useStyles()
	const theme = useMantineTheme()
	return (
		<Grid
			sx={{
				border: '1px solid transparent',
				borderRadius: 4,
				width: fullWidth ? '100%' : 'auto',
				flex: 1,
				margin: 0,
				background: isOdd ? 'white' : theme.colors.gray[0],
			}}
		>
			<Grid.Col span={labelSpan} px="xs" className={classes.label}>
				<Text>{label}</Text>
			</Grid.Col>
			<Grid.Col span={12 - labelSpan} px="xs">
				<Text>{content}</Text>
			</Grid.Col>
		</Grid>
	)
}

export default RowWithLabel
