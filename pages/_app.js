import Cookies from "js-cookie";
import App from "next/app";
import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import withData from "../lib/apollo";

class MyApp extends App {
	// 下記の記述は関数コンポーネントでないのでクラスの書き方に対応した書き方
	// 関数コンポーネントで書くと以下になる
	// const [state, setState] = useState(null);
	state = {
		user: null,
	};
	setUser = (user) => {
		this.setState({ user });
	};

	// すでにユーザーのクッキー情報が残っているかを確認する
	componentDidMount() {
		const token = Cookies.get("token"); // tokenの中にjwtが入っている

		if (token) {
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(async (res) => {
				if (!res.ok) {
					Cookies.remove("token");
					this.setState({ users: null });
					return null;
				}
				const user = await res.json();
				this.setUser(user);
			});
		}
	}

	render() {
		const { Component, pageProps } = this.props;
		return (
			<AppContext.Provider
				value={{ user: this.state.user, setUser: this.setUser }}
			>
				<>
					<Head>
						<link
							rel="stylesheet"
							href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
						/>
					</Head>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</>
			</AppContext.Provider>
		);
	}
}

export default withData(MyApp);
