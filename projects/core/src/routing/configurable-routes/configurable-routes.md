# Configurable routes

TODO: add table of contents

URL to every route in Storefront and Shell App can be configurable and translatable. This means that we don't have to hardcode URLs anymore in:

- `path` and `redirectTo` properties of routes
- directives `routerLink` in HTML templates
- method `Router.navigate` in Typescript code

Instead of it, URLs will be defined only in the Storefront's config under unique route names. And everywhere else only those unique route names will be used.

## Config

The default config for Storefront's pages can be found in [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts).
```typescript
// defaut-storefront-routes-translations.ts
default: {
    /* ... */
    product: { // `product` key is a unique name of the route
        paths: ['product/:productCode'],
        /* ... */
    }
    /* ... */
}
```

However, this config can be extended in the Shell App:

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                // `product` key is a unique name of the route
                product: { paths: [':productCode/custom/product-path'] }
            }
        }
    }
})
```

**TEMPORARY LIMITIATION:** only English language (`en`) is supported, but it will change in the future


## Navigation links

Navigation links can be automatically generated using `cxTranslateURL` pipe. It can:

1. transform unique route's name into configured URL. For example:
    ```html
    <!-- `product` is a unique name of the route -->
    <a [routerLink]="['product'] | cxTranslateURL: [{ productCode: 1234 }]"`></a>
    ```
    
    ```html
    <!-- result -->
    <a href="1234/custom/product-path"></a>
    ```
    **BY CONVENTION**, when pipes' argument is an array, then it's recognized as unique route's name

2. transform default URL into configured URL. For example:
    ```html
    <!-- `cmsData.URL === '/product/1234` is URL of default shape -->
    <a [routerLink]="cmsData.URL | cxTranslateURL"`></a> 
    ```
    ```html
    <!-- result -->
    <a href="1234/custom/product-path"></a>
    ```
    **BY CONVENTION**, when pipes' argument is a string, then it's recognized as an URL of default shape

If pipe cannot translate url due to any reason, it returns the root URL (`/`). Example causes:

- missing translations in config
- typo in the route's name
- unknown shape of default URL

## Routes

To translate paths in routes, they need a specific `data` property `cxPath`. For example:

```typescript
const routes: Routes = [
    {
        data: { cxPath: 'product' } // `product` is a unique name of the route 
        path: null, // Storefront's config will replace this value in bootstrap time
        component: ProductPageComponent
    }
];
```
FAQ:
> Why `path` can't be left `undefined`?

- Because Angular requires any defined `path` in compilation time.


---
## Additional params in URL
More params can be configured for URLs (for example for SEO purposes):

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                // `product` key is a unique name of the route
                product: { 
                    paths: [
                        // :productCode is an obligatory param
                        // :productName is a new param
                        ':productCode/custom/product-path/:productName',
                    ] 
                }
            }
        }
    }
})
```


```html
<!-- `product` is a unique name of the route -->
<a [routerLink]="['product'] | cxTranslateURL: [{ productCode: 1234 }]"`></a>

<!-- result -->
<a href="1234/custom/product-path"></a>
```

### Additional params in URL vs. URL of default shape

- If URL coming from CMS doesn't contain `:productName` param, an alias without `:productName` param has to be configured too (otherwise URL from CMS will be translated to `/`):

    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                en: {
                    // `product` key is a unique name of the route
                    product: { 
                        paths: [
                            // :productCode is an obligatory param
                            // :productName is a new param
                            ':productCode/custom/product-path/:productName',
                            ':productCode/custom/product-path',
                        ] 
                    }
                }
            }
        }
    })
    ```

    ```html
    <!-- `cmsData.URL === '/product/1234` is URL of default shape -->
    <a [routerLink]="cmsData.URL | cxTranslateURL"`></a> 

    <!-- result -->
    <a href="1234/custom/product-path"></a>
    ```

- However, if URL coming from CMS actually **does contain** a non-default `:productName` param, it suffices to override default URLs in the config:

    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                default: {
                    product: {
                        paths: ['product/:productCode/:productName']
                    }
                },
                en: {
                    product: { 
                        // :productCode is an obligatory param
                        // :productName is a new param
                        paths: [':productCode/custom/product-path/:productName'] 
                    }
                }
            }
        }
    })
    ```

    ```html
    <!-- `cmsData.URL === '/product/1234/ABC` is URL of default shape -->
    <a [routerLink]="cmsData.URL | cxTranslateURL"`></a> 

    <!-- result -->
    <a href="1234/custom/product-path/ABC"></a>
    ```

### Params mapping
A thick domain object can be passed to `cxTranslateUrl` as params instead of thin object with only obligatory params. However to translate properly the URL, the route params' names must match to names of properties in given object. Otherwise, we should configure default `paramsMapping`:
```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            default: {
                product: {
                    paramsMapping: { productCode: 'code' }
                }
            },
            en: {
                product: { paths: [':productCode/custom/product-path'] }
            }
        }
    }
})
```

**Note:** Default params mapping can be found in [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts).

```html
<!-- 
    productObject === {
        code: 1234,
        name: 'ABC'
        images: {...},
        price: {...}
        ...
    }
    -->
<a [routerLink]="['product'] | cxTranslateURL: [productObject]"`></a>

<!-- result -->
<a href="1234/custom/product-path"></a>
```

!!! Names of params in default URLs should not be changed, because they are hardcoded used in components. So please don't do:
```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            default: {
                product: {
                    paramsMapping: { customProductCodeParam: 'code' }
                }
            },
            en: {
                product: { paths: ['product/:customProductCodeParam'] } // dont replace standard :productCode param name
            }
        }
    }
})
```

## Disabling routes
To disable a route (to remove it from Angular's router config and prevent generating links to this route) it suffices to set `null` for it's unique name in the config:

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                product: null // `product` is a unique name of the route
            }
        }
    }
})
```
```html
<!-- `product` is a unique name of the route -->
<a [routerLink]="['product'] | cxTranslateURL: [{ productCode: 1234 }]"`></a>

<!-- result -->
<a href="/"></a>
```
```html
<!-- `cmsData.URL === '/product/1234` is URL of default shape -->
<a [routerLink]="cmsData.URL | cxTranslateURL"`></a> 

<!-- result -->
<a href="/"></a>
```

### Current limitations

- only english (`en`) translations are used


### Plans

### Work in progress:

More ways to extend default routes translations config can be found under this link.
> SPIKE TODO: write doc and add link here

### Whe can pass to links whole entity


### Params mapping


### Overriding default URLs
TODO: describe how it populates to all languages and how it changes behaviour of default URLs recognition