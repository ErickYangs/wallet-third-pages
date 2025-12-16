import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  useWalletClient,
} from "wagmi";
import { formatEther } from "viem";
import "./Email.css";
import { useRef, useState, useEffect } from "react";
import { TaskOnEmbed } from "@taskon/embed";
import { signMessage } from "../utils/signMessage";
export default function Wallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const { data: balance } = useBalance({
    address: address,
  });
  const chainId = useChainId();
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<TaskOnEmbed | null>(null);
  const [isEmbedInitialized, setIsEmbedInitialized] = useState(false);
  const [isEvmLoggedIn, setIsEvmLoggedIn] = useState(false);
  const loginWithWallet = async () => {
    console.log("loginWithWallet");
    console.log("embedRef.current", embedRef.current);
    console.log("isConnected", isConnected);
    console.log("address", address);
    console.log("walletClient", walletClient);
    if (!embedRef.current || !isConnected || !address) {
      return;
    }

    if (!embedRef.current.initialized) {
      console.log("TaskOn embed is not initialized yet, waiting...");
      return;
    }

    try {
      console.log("Logging in with EVM wallet:", address);
      const clientId = import.meta.env.VITE_PUBLIC_TASKON_CLIENT_ID!;
        const { signature, timestamp } = await signMessage(
        clientId,
        "evm",
        address,
      );

      await embedRef.current.login({
        type: "WalletAddress",
        account: address,
        signature: signature,
        timestamp: timestamp,
        provider: walletClient,
      });

      setIsEvmLoggedIn(true);
      localStorage.setItem("taskon_evm_login_state", "true");
      console.log("EVM login successful");
    } catch (error) {
      console.error("EVM login failed:", error);
      // Don't update login state on failure
    }
  };


  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing TaskOn embed...');
    
    const embed = new TaskOnEmbed({
      baseUrl: import.meta.env.VITE_PUBLIC_TASKON_BASE_URL!,
      containerElement: containerRef.current,
      oauthToolUrl: 'https://stage.generalauthservice.com'
    });

    const handleLoginRequired = () => {
      console.log('TaskOn loginRequired event triggered');
    //   openConnectModal?.();
    };
    
    const handleRouteChanged = (fullPath: string) => {
      console.log('TaskOn route changed:', fullPath);
      // You can synchronize and update the parent page's URL or state here
      // Example: window.history.replaceState(null, '', `/evm${fullPath}`);
    };

    embed.on('loginRequired', handleLoginRequired);
    embed.on('routeChanged', handleRouteChanged);

    // Initialize the embed
    embed.init().then(() => {
      console.log('TaskOn embed initialized successfully');
      embedRef.current = embed;
      setIsEmbedInitialized(true);
    }).catch((error) => {
      console.error('TaskOn embed initialization failed:', error);
    });

    return () => {
      console.log('Cleaning up TaskOn embed...');
      embed.destroy();
      embedRef.current = null;
      setIsEmbedInitialized(false);
    };
  }, []); // Only initialize once
  // Auto-login when wallet connects and embed is ready
  useEffect(() => {
    console.log("useEffect1");
    console.log("isConnected", isConnected);
    console.log("isEmbedInitialized", isEmbedInitialized);
    console.log("isEvmLoggedIn", isEvmLoggedIn);
    console.log("address", address);
    console.log("walletClient", walletClient);
    // Only auto-login when all conditions are met AND wallet is actually connected
    if (
      isConnected &&
      isEmbedInitialized &&
      !isEvmLoggedIn &&
      address &&
      walletClient
    ) {
      console.log("Auto-login triggered: wallet connected and embed ready");
      loginWithWallet();
    }
  }, [isConnected, isEmbedInitialized, address, walletClient]);


  const logout = () => {
    if (!embedRef.current) return;
    embedRef.current.logout();
    setIsEvmLoggedIn(false);
    localStorage.removeItem("taskon_evm_login_state");
    disconnect();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>钱包页面</h1>

      {!isConnected ? (
        <div>
          <h2>连接钱包</h2>
          <p>请选择一个钱包来连接：</p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                {isPending ? "连接中..." : `连接 ${connector.name}`}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>钱包信息</h2>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <p>
              <strong>地址:</strong> {address}
            </p>
            <p>
              <strong>余额:</strong>{" "}
              {balance
                ? `${formatEther(balance.value)} ${balance.symbol}`
                : "加载中..."}
            </p>
            <p>
              <strong>链ID:</strong> {chainId}
            </p>
          </div>

          <button
            onClick={() => logout()}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            断开连接
          </button>
       
        </div>
      )}
         {/* TaskOn Embed Container */}
         <main style={{ marginTop: "20px" }}>
            <div ref={containerRef} className="email-container" />
          </main>
    </div>
  );
}
