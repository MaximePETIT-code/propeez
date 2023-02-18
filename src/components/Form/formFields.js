import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import DatePicker from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import styles from './reportForm.module.css';

export default function FormFields({
	title,
	setTitle,
	description,
	setDescription,
	address,
	setAddress,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	category,
	setCategory,
	categories,
	handleChange,
	noEndDate,
}) {
	const formFields = [
		{
			type: 'text',
			name: 'title',
			label: 'Titre*',
			placeholder: "Titre de l'incident",
			onChange: (e) => setTitle(e.target.value),
			value: title,
		},
		{
			type: 'textarea',
			name: 'description',
			label: 'Description*',
			placeholder: "Description de l'incident",
			onChange: (e) => setDescription(e.target.value),
			value: description,
		},
		{
			type: 'autocomplete',
			name: 'address',
			label: 'Addresse*',
			placeholder: 'Address',
			onChange: setAddress,
			component: (
				<div className={styles.input_search}>
					<GooglePlacesAutocomplete
						apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
						apiOptions={{ language: 'fr', region: 'fr' }}
						autocompletionRequest={{
							componentRestrictions: {
								country: 'fr',
							},
						}}
						selectProps={{
							address,
							onChange: setAddress,
						}}
					/>
				</div>
			),
		},
		{
			type: 'date',
			name: 'start_date',
			label: 'Date de début*',
			component: (
				<div className={styles.date_picker}>
					<DatePicker
						onChange={(date) => {
							const d = new Date(date).toLocaleDateString('fr-FR');
							setStartDate(d);
						}}
						selected={
							new Date(
								startDate.split('/')[1] +
									' ' +
									startDate.split('/')[0] +
									' ' +
									startDate.split('/')[2]
							)
						}
						startDate={
							new Date(
								startDate.split('/')[1] +
									' ' +
									startDate.split('/')[0] +
									' ' +
									startDate.split('/')[2]
							)
						}
						endDate={
							endDate &&
							new Date(
								endDate?.split('/')[1] +
									' ' +
									endDate?.split('/')[0] +
									' ' +
									endDate?.split('/')[2]
							)
						}
						minDate={new Date()}
						locale={fr}
						dateFormat="dd/MM/yyyy"
					/>
				</div>
			),
		},
		!noEndDate && {
			type: 'date',
			name: 'end_date',
			label: 'Date de fin',
			component: (
				<div className={styles.date_picker}>
					<DatePicker
						onChange={(date) => {
							const d = new Date(date).toLocaleDateString('fr-FR');
							setEndDate(d);
						}}
						selected={
							endDate &&
							new Date(
								endDate?.split('/')[1] +
									' ' +
									endDate?.split('/')[0] +
									' ' +
									endDate?.split('/')[2]
							)
						}
						startDate={
							new Date(
								startDate.split('/')[1] +
									' ' +
									startDate.split('/')[0] +
									' ' +
									startDate.split('/')[2]
							)
						}
						endDate={
							endDate &&
							new Date(
								endDate?.split('/')[1] +
									' ' +
									endDate?.split('/')[0] +
									' ' +
									endDate?.split('/')[2]
							)
						}
						minDate={
							new Date(
								startDate.split('/')[1] +
									' ' +
									startDate.split('/')[0] +
									' ' +
									startDate.split('/')[2]
							)
						}
						locale={fr}
						dateFormat="dd/MM/yyyy"
					/>
				</div>
			),
		},
		{
			name: 'category',
			type: 'select',
			label: 'Catégorie*',
			value: category,
			options: categories.map((e, i) => (
				<option key={i} value={e.id}>
					{e.type}
				</option>
			)),
			onChange: (e) => setCategory(e.target.value),
		},
		{
			type: 'file',
			name: 'image',
			label: 'Image*',
			accept: '.jpg, .png, .jpeg',
			onChange: handleChange,
		},
	];

	return formFields.map((field, index) => {
		if (!field) return null;

		return (
			<div className={styles.item} key={index}>
				{field.type === 'textarea' ? (
					<>
						<label>{field.label}</label>
						<textarea
							name={field.name}
							placeholder={field.placeholder}
							onChange={field.onChange}
							value={field.value}
						/>
					</>
				) : field.type === 'autocomplete' || field.type === 'date' ? (
					<>
						<label>{field.label}</label>
						{field.component}
					</>
				) : field.type === 'text' ? (
					<>
						<label>{field.label}</label>
						<input
							type={field.type}
							name={field.name}
							placeholder={field.placeholder}
							onChange={field.onChange}
							value={field.value}
						/>
					</>
				) : field.type === 'file' ? (
					<>
						<label>{field.label}</label>
						<input
							onChange={handleChange}
							accept={field.accept}
							type={field.type}
						></input>
					</>
				) : (
					<>
						<label>{field.label}</label>
						<select onChange={field.onChange} value={field.value}>
							{field.options}
						</select>
					</>
				)}
			</div>
		);
	});
}
