import { useState } from "react";
import { Col, Input, InputGroup, InputGroupText, Row } from "reactstrap";
import RestaurantsList from "../components/RestaurantsList";

const index = () => {
	const [query, setQuery] = useState("");
	return (
		<div className="containe-fluid">
			<Row>
				<Col>
					<div className="search">
						<InputGroup>
							<InputGroupText>探す</InputGroupText>
							<Input
								placeholder="レストラン名を入力してください"
								onChange={(e) =>
									setQuery(e.target.value.toLocaleLowerCase())
								}
							/>
						</InputGroup>
					</div>
					<RestaurantsList search={query} />
				</Col>
			</Row>
			<style jsx>
				{`
					.search {
						margin: 20px;
						width: 500px;
					}
				`}
			</style>
		</div>
	);
};

export default index;
