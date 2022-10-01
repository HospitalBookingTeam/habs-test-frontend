import { Center, Pagination, createStyles, ScrollArea } from '@mantine/core'
import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

// use react-pdf-viewer
const options = {
	cMapUrl: 'cmaps/',
	cMapPacked: true,
	standardFontDataUrl: 'standard_fonts/',
}

const useStyles = createStyles((theme) => ({
	center: {
		position: 'relative',
	},
	pagination: {
		position: 'absolute',
		bottom: 20,
		left: '50%',
		transform: 'translateX(-50%)',
	},
}))

export default function PdfViewer({ file }: { file: any }) {
	const [page, onChange] = useState<number>(1)
	const [numPages, setNumPages] = useState(1)
	const { classes } = useStyles()

	function onDocumentLoadSuccess({
		numPages: nextNumPages,
	}: {
		numPages: number
	}) {
		setNumPages(nextNumPages)
	}

	return (
		<div className="Document">
			<Center className={classes.center}>
				<ScrollArea.Autosize maxHeight={400}>
					<Document
						file={file}
						onLoadSuccess={onDocumentLoadSuccess}
						options={options}
					>
						<Page pageNumber={page} />
					</Document>
				</ScrollArea.Autosize>
				<Pagination
					className={classes.pagination}
					total={numPages}
					page={page}
					onChange={onChange}
				/>
			</Center>
		</div>
	)
}
