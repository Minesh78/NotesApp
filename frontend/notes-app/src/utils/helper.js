export const validateEmail = (eamil) => {
	const regex = /^[^\@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(eamil);
};

export const getInitials = (name) => {
	if (!name) return "";

	const words = name.split(" ");
	let initials = "";

	for (let i = 0; i < Math.min(words.length, 2); i++) {
		initials += words[i][0];
	}

	return initials.toUpperCase();
};

export const getFirstName = (name) => {
	if (!name) return "";

	const words = name.split(" ");
	let firstName = "";
	firstName = words[0];

	return firstName.toUpperCase();
};
