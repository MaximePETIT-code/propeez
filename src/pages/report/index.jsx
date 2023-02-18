import React from 'react';
import Head from 'next/head';
import prisma from '/lib/prisma';
import ReportForm from '@/components/Form/reportForm';
import Layout from '@/components/Layout/layout';

export default function Report({ categories }) {
	return (
		<>
			<Head>
				<title>Signaler un incident - Propeez</title>
			</Head>

			<Layout>
				<ReportForm
					formTitle={'Signaler un incident que vous avez constaté'}
					categories={categories}
					api={'/api/postUserIncident'}
					noEndDate={true}
				/>
			</Layout>
		</>
	);
}

export async function getServerSideProps() {
	const categories = await prisma.category.findMany();

	return {
		props: { categories },
	};
}
