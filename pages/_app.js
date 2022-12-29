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
		cart: { items: [], total: 0 },
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

	// カートへ商品の追加
	addItem = (item) => {
		let { items } = this.state.cart;
		const newItem = items.find((i) => i.id === item.id);
		if (!newItem) {
			item.quantity = 1;
			// cartに追加する
			this.setState(
				{
					cart: {
						items: [...items, item],
						total: this.state.cart.total + item.price,
					},
				},
				() => Cookies.set("cart", this.state.cart.items)
			);
		}
		// すでに同じ商品がカートに入っているとき
		else {
			this.setState(
				{
					cart: {
						items: this.state.cart.items.map((item) =>
							item.id === newItem.id
								? Object.assign({}, item, {
										quantity: item.quantity + 1,
								  })
								: item
						),
						total: this.state.cart.total + item.price,
					},
				},
				() => Cookies.set("cart", this.state.cart.items)
			);
		}
	};

	render() {
		const { Component, pageProps } = this.props;
		return (
			<AppContext.Provider
				value={{
					user: this.state.user,
					cart: this.state.cart,
					setUser: this.setUser,
					addItem: this.addItem,
				}}
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
