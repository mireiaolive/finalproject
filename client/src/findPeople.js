import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    // console.log("properties from parent:", props);
    //call useState once for every state property you want your component to use
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState();
    const [results, setResults] = useState();
    //console.log("see users: ", users);
    //to mount component you will need to use useEffect
    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/api/findpeople");
            setUsers(data.users);
        })();
    }, []);

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get(`/api/findpeople/${searchTerm}`);
            if (!abort) {
                //console.log("see data: ", data);
                setResults(data.searchTerm);
            }
        })();
        return () => {
            abort = true;
        };
    }, [searchTerm]);

    //Rendering will involve converting an array of user objects into elements, done with map
    return (
        <div className="main-container">
            <div className="results-container">
                <h1>Find People</h1>
                <h2>Checkout who recently joined!</h2>
            </div>

            <div className="search-input">
                <p>Are you looking for someone in particular?</p>
                <input
                    placeholder="Enter name"
                    type="text"
                    name="find-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="results-box">
                {!searchTerm &&
                    users.map((user) => (
                        <div key={user.id}>
                            <div className="box">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="img-box"
                                        src={user.imageurl}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="results-box">
                {searchTerm &&
                    results.map((user) => (
                        <div key={user.id}>
                            <div className="box">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="img-box"
                                        src={user.imageurl}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
