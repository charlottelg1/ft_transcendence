import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { authenticatedWrapper, getAuth } from "../../utils/auth/wrapper";
import { httpClient } from "../../utils/http-client";
import NavBar  from "../../components/menu&footer/navBar";
import Footer from "../../components/menu&footer/footer";
import ProgressBar from "../../components/user/progressBar";
import Head from "next/head";
import StatsPlayer from "../../components/user/statsPlayer";
import { io } from "socket.io-client";
import { getCookie } from 'cookies-next'
import { useEffect, useRef, useState } from "react";
import Avatar from "../../components/avatar/Avatar";
import Achievements from "../../components/utils/Achievements_me";
import GameHistory from "../../components/game/gameHistory";
import Notifs from "../../components/notifications";

type MeProps = {
  user: {
    id: number;
    email: string;
    username: string;
	xp:	number;
	gameWon: number;
	gameLost: number;
  };
};

const Me = ({ user }: MeProps) => {

 const socketRef = useRef();

 const [notifs, setNotifs] = useState([]);
 const notifsRef = useRef(notifs);

  useEffect(() => {
	window.addEventListener('beforeunload', handleBeforeUnload);

    socketRef.current = io('http://localhost:3001/', { query: {
      authToken: getCookie('Auth'),
    }
    });

	socketRef.current.on("youAreInvitedToPlay", (sender) => {
		setNotifs(notifs => [...notifs, sender]);
		});

	socketRef.current.on("notifCanceled", (sender) => {
		setNotifs(prev => prev.filter(ntfs => ntfs.id != sender.id));
		});

  return () => {
	for (let value of notifsRef.current)
			socketRef.current.emit("gameInvitationDeclined", {waitingPlayer: value});
	socketRef.current.off("youAreInvitedToPlay");
	socketRef.current.off("notifCanceled");
    socketRef.current.disconnect();
	window.removeEventListener('beforeunload', handleBeforeUnload);
  }
}, [])

  useEffect(() => {
	notifsRef.current = notifs;
	}, [notifs]);

	const handleBeforeUnload = () => {
		for (let value of notifsRef.current)
					socketRef.current.emit("gameInvitationDeclined", {waitingPlayer: value});
		setNotifs([]);
	}
  // const router = useRouter()
  const level = user.xp/100;
  return (
    <>
	<Head><title>Profile</title></Head>
    <NavBar/>
		<div className="mx-auto py-8 form-chat">
			<div className="min-w-full border-color-5 rounded lg:grid lg:grid-col-2 gap-2">
				<div className="lg:col-span-1 color-4">
					<div className="flex justify-center items-center">
						<Avatar id_user ={user.id}/>
					</div>
					<div className="home-subtitle flex justify-center items-center">
						{user && user.login}
					</div>
					<div className="home-text flex justify-center items-center">
						<h1>Email : {user && user.email}</h1>
					</div>
					<div className="home-text flex justify-center items-center">
						<h1>Level : {level} </h1> 
					</div>
					<ProgressBar/>
					<div className="home-text flex justify-center items-center">
						{(user && user.gameWon>1) ? <h1>Games Won : {user && user.gameWon}</h1>: <h1>Game Won : {user && user.gameWon}</h1>}
					</div>
					<div className="home-text flex justify-center items-center">
						{(user && user.gameLost>1) ? <h1>Games Lost : {user && user.gameLost}</h1>: <h1>Game Lost : {user && user.gameLost}</h1>}
					</div>
				</div>
				<div className="lg:col-span-2">
					<GameHistory/>
				</div>
				<div className="lg:col-span-3">
						<div className="home-text flex justify-center items-center">
							<Achievements/>
						</div>
				</div>
				<div className="home-text m-16 flex justify-center items-center lg:col-span-3">
					<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.5 4.29076C13.0368 4.10325 12.5305 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C13.1947 12 14.2671 11.4762 15 10.6458M18.2015 1.21321C18.1111 1.34235 18.1111 1.52453 18.1111 1.88889V2.48507C18.0219 2.5166 17.9349 2.55273 17.8504 2.59319L17.4287 2.17155C17.1711 1.91391 17.0423 1.78509 16.887 1.75772C16.8296 1.74759 16.7708 1.74759 16.7134 1.75772C16.5581 1.78509 16.4293 1.91391 16.1716 2.17155C15.914 2.4292 15.7852 2.55802 15.7578 2.71327C15.7477 2.77071 15.7477 2.82948 15.7578 2.88692C15.7852 3.04217 15.914 3.17099 16.1716 3.42863L16.5932 3.85024C16.5528 3.93483 16.5166 4.02188 16.4851 4.11111H15.8889C15.5245 4.11111 15.3424 4.11111 15.2132 4.20154C15.1654 4.23499 15.1239 4.27655 15.0904 4.32432C15 4.45346 15 4.63564 15 5C15 5.36436 15 5.54654 15.0904 5.67568C15.1239 5.72345 15.1654 5.76501 15.2132 5.79846C15.3423 5.88889 15.5245 5.88889 15.8889 5.88889H16.4851C16.5166 5.9781 16.5527 6.06512 16.5932 6.14968L16.1716 6.57134C15.9139 6.82898 15.7851 6.9578 15.7577 7.11305C15.7476 7.17049 15.7476 7.22926 15.7577 7.2867C15.7851 7.44196 15.9139 7.57078 16.1716 7.82842C16.4292 8.08606 16.558 8.21488 16.7133 8.24225C16.7707 8.25238 16.8295 8.25238 16.8869 8.24225C17.0422 8.21488 17.171 8.08606 17.4286 7.82842L17.8503 7.40677C17.9349 7.44725 18.0219 7.48339 18.1111 7.51493V8.11111C18.1111 8.47547 18.1111 8.65765 18.2015 8.78679C18.235 8.83457 18.2765 8.87612 18.3243 8.90958C18.4535 9 18.6356 9 19 9C19.3644 9 19.5465 9 19.6757 8.90958C19.7235 8.87612 19.765 8.83457 19.7985 8.78679C19.8889 8.65765 19.8889 8.47547 19.8889 8.11111V7.51493C19.9781 7.48339 20.0652 7.44724 20.1498 7.40675L20.5714 7.82841C20.8291 8.08605 20.9579 8.21487 21.1131 8.24225C21.1706 8.25237 21.2293 8.25237 21.2868 8.24225C21.442 8.21487 21.5709 8.08605 21.8285 7.82841C22.0861 7.57077 22.215 7.44195 22.2423 7.28669C22.2525 7.22925 22.2525 7.17049 22.2423 7.11305C22.215 6.95779 22.0861 6.82897 21.8285 6.57133L21.4068 6.14965C21.4473 6.0651 21.4834 5.97808 21.5149 5.88889H22.1111C22.4755 5.88889 22.6576 5.88889 22.7868 5.79846C22.8346 5.76501 22.8761 5.72345 22.9096 5.67568C23 5.54654 23 5.36436 23 5C23 4.63564 23 4.45346 22.9096 4.32432C22.8761 4.27655 22.8346 4.23499 22.7868 4.20154C22.6576 4.11111 22.4755 4.11111 22.1111 4.11111H21.5149C21.4834 4.02189 21.4472 3.93485 21.4068 3.85028L21.8284 3.42864C22.0861 3.171 22.2149 3.04218 22.2422 2.88693C22.2524 2.82949 22.2524 2.77072 22.2422 2.71328C22.2149 2.55802 22.086 2.4292 21.8284 2.17156C21.5708 1.91392 21.4419 1.7851 21.2867 1.75773C21.2293 1.7476 21.1705 1.7476 21.113 1.75773C20.9578 1.7851 20.829 1.91392 20.5713 2.17156L20.1497 2.59321C20.0651 2.55274 19.9781 2.5166 19.8889 2.48507V1.88889C19.8889 1.52453 19.8889 1.34235 19.7985 1.21321C19.765 1.16543 19.7235 1.12388 19.6757 1.09042C19.5465 1 19.3644 1 19 1C18.6356 1 18.4535 1 18.3243 1.09042C18.2765 1.12388 18.235 1.16543 18.2015 1.21321ZM20 5C20 5.55228 19.5523 6 19 6C18.4477 6 18 5.55228 18 5C18 4.44772 18.4477 4 19 4C19.5523 4 20 4.44772 20 5ZM9.31765 14H14.6824C15.1649 14 15.4061 14 15.6219 14.0461C16.3688 14.2056 17.0147 14.7661 17.3765 15.569C17.4811 15.8009 17.5574 16.0765 17.71 16.6278C17.8933 17.2901 17.985 17.6213 17.9974 17.8884C18.0411 18.8308 17.5318 19.6817 16.7756 19.9297C16.5613 20 16.2714 20 15.6916 20H8.30844C7.72864 20 7.43875 20 7.22441 19.9297C6.46818 19.6817 5.95888 18.8308 6.00261 17.8884C6.01501 17.6213 6.10668 17.2901 6.29003 16.6278C6.44262 16.0765 6.51891 15.8009 6.62346 15.569C6.9853 14.7661 7.63116 14.2056 8.37806 14.0461C8.59387 14 8.83513 14 9.31765 14Z" stroke="#464455" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
					<Link href={"/user/settings"}>Change your settings</Link>
				</div>
			</div>
		</div>
		<Footer/>
		{
			notifs.length > 0 && (
	   		 <Notifs senders={notifs} setNotifs={setNotifs} socket={socketRef.current} user={user}/>
		)
	  }
    </>
  );
};

export const getServerSideProps = authenticatedWrapper(
  async (context: GetServerSidePropsContext) => {
    const Auth = getAuth(context);
    const user = await httpClient.get(`${process.env.NEXT_PUBLIC_ME_ROUTE}`, {
      headers: {
        Cookie: `Auth=${Auth}`,
      },
    });
    return {
      props: {
        user: user.data,
      },
    };
  }
);

export default Me;
