import { getDataForm } from '/lib/formidable';
import { uploadImage } from '/lib/cloudinary';
import prisma from '/lib/prisma';
import { getSession } from 'next-auth/react';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handle(req, res) {
	const dataForm = await getDataForm(req);

	const session = await getSession({ req });

	const incident = JSON.parse(dataForm.fields.incident);
	const imageUploaded = dataForm.files.image;

	const imageData = await uploadImage(imageUploaded.filepath);

	const result = await prisma.incident.create({
		data: {
			title: incident.title,
			description: incident.description,
			address: incident.address,
			city: incident.city,
			latitude: incident.latitude,
			longitude: incident.longitude,
			startDate: incident.startDate,
			endDate: incident.endDate,
			category: {
				connect: {
					id: incident.categoryId,
				},
			},
			image: {
				create: {
					publicId: imageData.public_id,
					format: imageData.format,
					version: imageData.version.toString(),
				},
			},
			published: true,
		},
	});

	return res.json(result);
}
