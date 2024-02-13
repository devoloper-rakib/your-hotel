import { useSearchContext } from '../contexts/SearchContext';

const Search = () => {
	const search = useSearchContext();
	console.log(search);

	return <h1>search page</h1>;
};

export default Search;
