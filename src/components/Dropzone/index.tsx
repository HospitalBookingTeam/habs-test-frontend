import { ActionIcon, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconX, IconFile, IconTrashX } from "@tabler/icons";
import { Dropzone, DropzoneProps, FileWithPath, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";
import PdfViewer from "../PdfViewer";

export function BaseDropzone(props: Partial<DropzoneProps>) {
	const theme = useMantineTheme();
	const [file, setFile] = useState<FileWithPath[] | null>(null);

	const handleSetFile = (files: FileWithPath[] | null) => {
		setFile(files);
		if (props?.onChange) {
			props.onChange(files as any);
		}
	};
	return (
		<div>
			<Dropzone
				onDrop={(files) => {
					handleSetFile(files);
				}}
				onReject={(files) => console.log("rejected files", files)}
				maxSize={3 * 1024 ** 2}
				accept={PDF_MIME_TYPE}
				{...props}
			>
				<Group position="center" spacing="xl" style={{ minHeight: 100, pointerEvents: "none" }}>
					<Dropzone.Accept>
						<IconUpload
							size={50}
							stroke={1.5}
							color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
						/>
					</Dropzone.Accept>
					<Dropzone.Reject>
						<IconX size={50} stroke={1.5} color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]} />
					</Dropzone.Reject>
					<Dropzone.Idle>
						<IconFile size={50} stroke={1.5} />
					</Dropzone.Idle>

					<div>
						<Text size="xl" inline>
							Tải file xét nghiệm lên <Text span={true} color="red">
								*
							</Text>
						</Text>
						<Text size="sm" color="dimmed" inline mt={4}>
							Dung lượng không vượt quá 5mb
						</Text>
					</div>
				</Group>
			</Dropzone>

			{!!file && (
				<Stack sx={{ position: "relative" }}>
					<ActionIcon
						sx={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}
						color="red"
						onClick={() => handleSetFile(null)}
					>
						<IconX />
					</ActionIcon>
					<PdfViewer file={file?.[0]} />
				</Stack>
			)}
		</div>
	);
}
