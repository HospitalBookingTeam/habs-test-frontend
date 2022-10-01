import { Group, Text, useMantineTheme } from '@mantine/core'
import { IconUpload, IconPhoto, IconX, IconFile } from '@tabler/icons'
import { Dropzone, DropzoneProps, PDF_MIME_TYPE } from '@mantine/dropzone'
import { useState } from 'react'
import PdfViewer from '../PdfViewer'

export function BaseDropzone(props: Partial<DropzoneProps>) {
	const theme = useMantineTheme()
	const [file, setFile] = useState<any>(undefined)
	return (
		<div>
			<Dropzone
				onDrop={(files) => {
					console.log('accepted files', files)
					setFile(files)
					if (props?.onChange) {
						props.onChange(files as any)
					}
				}}
				onReject={(files) => console.log('rejected files', files)}
				maxSize={3 * 1024 ** 2}
				accept={PDF_MIME_TYPE}
				{...props}
			>
				<Group
					position="center"
					spacing="xl"
					style={{ minHeight: 100, pointerEvents: 'none' }}
				>
					<Dropzone.Accept>
						<IconUpload
							size={50}
							stroke={1.5}
							color={
								theme.colors[theme.primaryColor][
									theme.colorScheme === 'dark' ? 4 : 6
								]
							}
						/>
					</Dropzone.Accept>
					<Dropzone.Reject>
						<IconX
							size={50}
							stroke={1.5}
							color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
						/>
					</Dropzone.Reject>
					<Dropzone.Idle>
						<IconFile size={50} stroke={1.5} />
					</Dropzone.Idle>

					<div>
						<Text size="xl" inline>
							Tải file xét nghiệm lên
						</Text>
						<Text size="sm" color="dimmed" inline mt={7}>
							Dung lượng không vượt quá 5mb
						</Text>
					</div>
				</Group>
			</Dropzone>

			{!!file && <PdfViewer file={file?.[0]} />}
		</div>
	)
}
