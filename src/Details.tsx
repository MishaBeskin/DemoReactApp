import React, { lazy } from "react";
import { connect } from "react-redux";
import pet, { Photo, AnimalResponse } from "@frontendmasters/pet";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoundary";
import { navigate, RouteComponentProps } from "@reach/router";

const Modal = lazy(() => import("./Modal"));

class Details extends React.Component<RouteComponentProps<{ id: string, theme: string }>> {

    public state = {
        loading: true,
        showModal: false,
        name: "",
        animal: "",
        location: "",
        description: "",
        media: [] as Photo[],
        url: "",
        breed: ""
    };

    public componentDidMount() {
        if (!this.props.id) {
            navigate("/");
            return;
        }
        pet
            .animal(+this.props.id)
            .then(({ animal }) => {
                this.setState({
                    url: animal.url,
                    name: animal.name,
                    animal: animal.type,
                    location: `${animal.contact.address.city}, ${animal.contact.address.state
                        }`,
                    description: animal.description,
                    media: animal.photos,
                    breed: animal.breeds.primary,
                    loading: false
                });
            })
            .catch((err: Error) => this.setState({ error: err }));
    }
    public toggleModal = () => this.setState({ showModal: !this.state.showModal });
    adopt = () => navigate(this.state.url);
    render() {
        if (this.state.loading) {
            return <h1>loading … </h1>;
        }

        const { animal, breed, location, description, media, name, url, showModal } = this.state;

        return (
            <div className="details">
                <Carousel media={media} />
                <div>
                    <h1>{name}</h1>
                    <h2>{`${animal} — ${breed} — ${location}`}</h2>
                    <button style={{ backgroundColor: this.props.theme }} onClick={this.toggleModal}>
                        Adopt {name}
                    </button>
                    <p>{description}</p>
                    {
                        showModal ? (
                            <Modal>
                                <div>
                                    <h1>Would you like to adopt {name}?</h1>
                                    <div className="buttons">
                                        <button onClick={this.adopt}>Yes</button>
                                        <button onClick={this.toggleModal}>No</button>
                                    </div>
                                </div>
                            </Modal>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ theme }) => ({ theme });

const WrappedDetails = connect(mapStateToProps)(Details);

export default function DetailsErrorBoundary(props: RouteComponentProps<{ id: string }>) {
    return (
        <ErrorBoundary>
            <WrappedDetails  {...props} />
        </ErrorBoundary>
    );
}