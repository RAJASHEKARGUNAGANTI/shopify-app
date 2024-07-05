import {
  Page,
  Layout,
  Modal,
} from "@shopify/polaris";
import { ModalContent, TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from 'axios'


export default function HomePage() {

  const fetch = useAuthenticatedFetch();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [isModelOpen, setImodelOpen] = useState(false);
  const [themeData, setThemeData] = useState(null);

  const handleClick =(product)=>{
    setProduct(product);
    setImodelOpen(true);
    // console.log("Button clicked")
  }
  
  const handleClose =()=>{
    setProduct(null);
    setImodelOpen(false);

  }
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let request = await fetch("/api/2024-04/products");
        let response = await request.json();
        setProducts(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);


  // useEffect(() => {
  //   const fetchMetaData = async () => {
  //     try {
  //       let id = 8387996614807
  //       let request = await fetch('/api/2024-04/blogs.json');
  //       let response = await request.json();
  //       setProducts(response.data);
  //       console.log("Metada ==" + response.data);
  //     } catch (error)  {
  //       console.log(error);
  //     }
  //   };

  //   fetchMetaData();
  // }, []);

  // const injectScriptTag = async () => {
  //   const scriptTag = {
  //     script_tag: {
  //       event: 'onload',
  //       src: 'https://github.com/RAJASHEKARGUNAGANTI/script-Inject/blob/master/language_dropdown.js' // Replace with your hosted URL
  //     }
  //   };
  
  //   try {
  //     const response = await fetch('api/2024-04/script_tags.json', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         // 'X-Shopify-API': 'atkn_40ab498c94e6698ce5d560ca6148623cea2aa4fad4db3fe0ba41157cef531afe'
  //       },
  //       body: JSON.stringify(scriptTag)
  //     });
  
  //     if (response.ok) {
  //       console.log('Script tag successfully added.');
  //     } else {
  //       console.error('Failed to add script tag:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error adding script tag:', error);
  //   }
  // };
  


    const fetchThemeData = async () => {
      try {
        const shop = "dev-xl.myshopify.com"; // Replace with your shop name
        const response = await fetch(`/test`);
        alert(response);
        console.log(response);
        if (response.status !== 200) {
          throw new Error(`Error fetching themes: ${response.statusText}`);
        }
        console.log("API Response:", response.body); // Log the raw response
        // const activeTheme = response.data.themes.find(theme => theme.role === 'main');
        setThemeData(activeTheme);
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

 


  const getThemeId = async () => {

    alert();
    fetchThemeData();
    if (themeData) {
      return themeData.id;
    } else {
      console.log('Theme data not available');
    }
  };
  
  return (
    <Page fullWidth>
      <TitleBar title="Home" primaryAction={null} />
      <button onClick={getThemeId}>Inject Script</button>
      <Layout>
        {products.map((product, i) => {
          const imageUrl = product.images[0]?.src || '';
          return (
            <div key={i}>
              <ProductCard 
                title={product.title} 
                image={imageUrl}
                price={product.variants[0].price} 
                description={product.body_html}
                linkURL={product.handle}
                onClick={()=> handleClick(product)}
              />
            </div>
          )
        })}
      </Layout>
      {product && (
        <Modal
        open={isModelOpen}
        onClose={handleClose}
        >
        <Modal.Section>
        <h2>{product.title}</h2>
        <div className="flex flex-col">
        <div className="w-full p-4">
        <h3 className="font-semibold ">Original</h3>
        <p className="text-blue-600 ">{product.body_html.replace(/<\/?p>/g, '')}</p>
        <p className="text-green-600 ">{`https://dev-xl.myshopify.com/products/${product.handle}`}</p>
        </div>
        <button className="bg-gray-500 h-10 rounded-lg font-semibold text-xl text-white">Translate</button>
        <div className="w-full p-4">
        <h3 className="font-semibold ">Translated</h3>
        <p className="text-blue-600 ">{product.body_html.replace(/<\/?p>/g, '')}</p>
        <p className="text-green-600 ">{`https://dev-xl.myshopify.com/products/${product.handle}`}</p>
        </div>
        </div>
        </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
