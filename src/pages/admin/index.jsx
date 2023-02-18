import Navbar from '@/components/Admin/Nav/navbar';
import IncidentCard from '@/components/Admin/IncidentCard/IncidentCard';
import { getSession } from 'next-auth/react';
import styles from './index.module.css';
import { Splide, SplideTrack } from '@splidejs/react-splide';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Category from '@/components/Admin/Category/Category';
import InteractiveMap from '@/components/MapContainer/InteractiveMap/map';
import { Marker } from 'react-map-gl';
import Pin from '@/components/MapContainer/InteractiveMap/Pin/pin';
import { useMemo } from 'react';
import Head from 'next/head';
import prisma from '/lib/prisma';

export default function Admin({ incidents }) {
	const router = useRouter();
	const refreshData = () => {
		router.replace(router.asPath);
	};

	const [filter, setFilter] = useState('all');
	const allIncidents = incidents;
	const [filteredIncidents, setFilteredIncidents] = useState(allIncidents);
	const [selectedIncident, setSelectedIncident] = useState(
		allIncidents?.[0] || {}
	);

	useEffect(() => {
		if (filter === 'all') {
			setFilteredIncidents(allIncidents);
			setSelectedIncident(allIncidents?.[0] || {});
		} else if (filter === 'pending') {
			setFilteredIncidents(
				allIncidents.filter((incident) => !incident.published)
			);
			setSelectedIncident(
				allIncidents.filter((incident) => !incident.published)?.[0] || {}
			);
		} else if (filter === 'published') {
			setFilteredIncidents(
				allIncidents.filter((incident) => incident.published)
			);
			setSelectedIncident(
				allIncidents.filter((incident) => incident.published)?.[0] || {}
			);
		}
	}, [filter]);

	const publishIncident = async () => {
		try {
			await fetch('/api/publishIncident', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: selectedIncident.id,
				}),
			});
			refreshData();
		} catch (error) {
			console.error(error);
		}
	};

	const deleteIncident = async () => {
		try {
			await fetch('/api/deleteIncident', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: selectedIncident.id,
				}),
			});
			refreshData();
		} catch (error) {
			console.error(error);
		}
	};

	const pins = useMemo(
		() => (
			<Marker
				longitude={selectedIncident.longitude}
				latitude={selectedIncident.latitude}
				anchor="bottom"
			>
				<Pin active={true} />
			</Marker>
		),
		[selectedIncident]
	);

	return (
		<>
			<Head>
				<title>Backoffice - Propeez</title>
			</Head>
			<div className={styles.layout}>
				<Navbar />
				<div style={{ width: '320px' }}></div>
				<div className={styles.content}>
					<div className={styles.header}>
						<div className={styles.type}>
							<p
								className={filter === 'all' ? styles.active : null}
								onClick={() => setFilter('all')}
							>
								Tout ({allIncidents.length})
							</p>
							<p
								className={filter === 'pending' ? styles.active : null}
								onClick={() => setFilter('pending')}
							>
								En attente (
								{allIncidents.filter((incident) => !incident.published).length})
							</p>
							<p
								className={filter === 'published' ? styles.active : null}
								onClick={() => setFilter('published')}
							>
								Publié (
								{allIncidents.filter((incident) => incident.published).length})
							</p>
						</div>
						<Link href="/admin/report">
							<div className={styles.button}>
								<p>Déclarer un incident</p>
							</div>
						</Link>
					</div>
					{filteredIncidents?.length > 0 ? (
						<div className={styles.row}>
							<Splide
								className={styles.slider}
								hasTrack={false}
								options={{
									type: 'slide',
									gap: '20px',
									perMove: 2,
									speed: 1000,
									wheel: true,
									height: '100%',
									autoHeight: true,
									pagination: false,
									direction: 'ttb',
									arrows: false,
								}}
							>
								<SplideTrack className={styles.track}>
									{filteredIncidents.map((incident, i) => (
										<IncidentCard
											incident={incident}
											selectedIncident={selectedIncident}
											key={i}
											onClick={() => setSelectedIncident(incident)}
										/>
									))}
								</SplideTrack>
							</Splide>
							<div className={styles.incident}>
								<div className={styles.incidentHead}>
									<p className={styles.incidentTitle}>
										{selectedIncident.title}
									</p>
									<div className={styles.action}>
										<Image
											className={styles.edit}
											src="/images/edit.svg"
											width={24}
											height={24}
											alt="edit icon"
											onClick={() =>
												router.push(`/admin/edit/${selectedIncident.id}`)
											}
										/>
										{filter === 'pending' ? (
											<div
												className={styles.publish}
												onClick={() => publishIncident()}
											>
												<p>Publier</p>
											</div>
										) : null}
										<div
											className={styles.delete}
											onClick={() => deleteIncident()}
										>
											<p>Supprimer</p>
										</div>
									</div>
								</div>
								<div className={styles.separator}></div>
								<div className={styles.incidentContent}>
									<div className={styles.incidentDesc}>
										<p>
											<strong>Lieu : </strong>
											{selectedIncident.address}
										</p>
										<p>
											<strong>Début : </strong>
											{selectedIncident.startDate}
										</p>
										<p>
											<strong>Fin : </strong>
											{selectedIncident.endDate
												? selectedIncident.endDate
												: 'Date inconnue'}
										</p>
										<p>
											<strong>Description : </strong>
											{selectedIncident.description}
										</p>
										<Category category={selectedIncident.category} />
									</div>
									<Image
										src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/v${selectedIncident.image.version}/${selectedIncident.image.publicId}.${selectedIncident.image.format}`}
										alt={selectedIncident.title}
										className={styles.image}
										width={450}
										height={337}
									/>
								</div>
								<InteractiveMap
									viewport={{
										longitude: selectedIncident.longitude,
										latitude: selectedIncident.latitude,
									}}
									pins={pins}
									disableSearch={true}
								/>
							</div>
						</div>
					) : (
						<div className={styles.empty}>
							<p>Aucun incident</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps({ req }) {
	const session = await getSession({ req });

	if (!session || !(session?.user.role === 'ADMIN')) {
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false,
			},
		};
	}

	const incidents = await prisma.incident.findMany({
		include: {
			image: true,
			category: true,
		},
	});

	return {
		props: { incidents },
	};
}
