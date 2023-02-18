import styles from './Category.module.css';

export default function Category({ category }) {
	return (
		<div
			className={styles.category}
			style={
				category
					? { backgroundColor: category.color }
					: { backgroundColor: '#000' }
			}
		>
			<p>{category.type}</p>
		</div>
	);
}
