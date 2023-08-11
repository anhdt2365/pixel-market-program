export type PixelMarketProgram = {
  "version": "0.1.0",
  "name": "pixel_market_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "operator",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "changeOperator",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOperator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updatePrice",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buy",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "operator",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PixelMarketErrorCode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OnlyAdmin"
          },
          {
            "name": "WrongOperator"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyEvent",
      "fields": [
        {
          "name": "id",
          "type": "string",
          "index": true
        }
      ]
    }
  ]
};

export const IDL: PixelMarketProgram = {
  "version": "0.1.0",
  "name": "pixel_market_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "operator",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "changeOperator",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOperator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updatePrice",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buy",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "operator",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PixelMarketErrorCode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OnlyAdmin"
          },
          {
            "name": "WrongOperator"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyEvent",
      "fields": [
        {
          "name": "id",
          "type": "string",
          "index": true
        }
      ]
    }
  ]
};
