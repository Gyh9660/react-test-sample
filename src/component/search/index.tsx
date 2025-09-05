import {useForm} from "react-hook-form";

interface IProps {
    clickSearch: (text: string) => void
}

interface SearchFormInputs {
    searchKeyword: string;
}

const Search = ({clickSearch}: IProps) => {
    const {register, handleSubmit} = useForm<SearchFormInputs>();
    const onSubmit = (data: SearchFormInputs) => {
        clickSearch(data.searchKeyword);
        console.log("12000,8000,4000,6000");
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("searchKeyword")} placeholder="Search..."/>
                <button type="submit">Search</button>
            </form>
        </>
    );
}

export default Search;