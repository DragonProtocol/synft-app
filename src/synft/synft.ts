export type Synft = {
  version: '0.1.0'
  name: 'synft'
  instructions: [
    {
      name: 'initializeInject'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'childTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'parentTokenAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'parentMintAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'childrenMeta'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'reversible'
          type: 'bool'
        },
        {
          name: 'bump'
          type: 'u8'
        },
      ]
    },
    {
      name: 'initializeFungibleTokenInject'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'ownerTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'parentTokenAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'parentMintAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'childrenMeta'
          isMut: true
          isSigner: false
        },
        {
          name: 'mint'
          isMut: false
          isSigner: false
        },
        {
          name: 'fungibleTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'reversible'
          type: 'bool'
        },
        {
          name: 'bump'
          type: 'u8'
        },
        {
          name: 'injectFungibleTokenAmount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'initializeSolInject'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'parentTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'parentMintAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'childrenMeta'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'reversible'
          type: 'bool'
        },
        {
          name: 'bump'
          type: 'u8'
        },
        {
          name: 'injectSolAmount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'extract'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'childTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'parentTokenAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'parentMintAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'childrenMeta'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'bump'
          type: 'u8'
        },
      ]
    },
    {
      name: 'extractSol'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'parentTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'parentMintAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'childrenMeta'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'bump'
          type: 'u8'
        },
      ]
    },
    {
      name: 'nftCopy'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'fromNftMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'nftMetaDataAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'nftMintAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'nftTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'mplProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'name'
          type: 'string'
        },
        {
          name: 'symbol'
          type: 'string'
        },
        {
          name: 'uri'
          type: 'string'
        },
      ]
    },
    {
      name: 'burnForSol'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'parentMintAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'parentTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'childrenMeta'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: []
    },
    {
      name: 'burnForToken'
      accounts: [
        {
          name: 'currentOwner'
          isMut: true
          isSigner: true
        },
        {
          name: 'parentMintAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'parentTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'childTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'childrenMeta'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'childrenMetadata'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'reversible'
            type: 'bool'
          },
          {
            name: 'child'
            type: 'publicKey'
          },
          {
            name: 'childType'
            type: {
              defined: 'ChildType'
            }
          },
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'parentMetadata'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'parent'
            type: 'publicKey'
          },
        ]
      }
    },
  ]
  types: [
    {
      name: 'ChildType'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'SOL'
          },
          {
            name: 'SPL'
          },
          {
            name: 'NFT'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'InvalidMetadataBump'
      msg: 'The bump passed in does not match the bump in the PDA'
    },
    {
      code: 6001
      name: 'InvalidAuthority'
      msg: 'Current owner is not the authority of the parent token'
    },
    {
      code: 6002
      name: 'InvalidExtractAttempt'
      msg: 'Only Reversible Synthetic Tokens can be extracted'
    },
    {
      code: 6003
      name: 'InvalidBurnType'
      msg: 'Wrong type of burn instruction for the token'
    },
  ]
}

export const IDL: Synft = {
  version: '0.1.0',
  name: 'synft',
  instructions: [
    {
      name: 'initializeInject',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'childTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'parentTokenAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'parentMintAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'childrenMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'reversible',
          type: 'bool',
        },
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'initializeFungibleTokenInject',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'ownerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'parentTokenAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'parentMintAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'childrenMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'fungibleTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'reversible',
          type: 'bool',
        },
        {
          name: 'bump',
          type: 'u8',
        },
        {
          name: 'injectFungibleTokenAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'initializeSolInject',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'parentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'parentMintAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'childrenMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'reversible',
          type: 'bool',
        },
        {
          name: 'bump',
          type: 'u8',
        },
        {
          name: 'injectSolAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'extract',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'childTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'parentTokenAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'parentMintAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'childrenMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'extractSol',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'parentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'parentMintAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'childrenMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'nftCopy',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'fromNftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftMetaDataAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mplProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'symbol',
          type: 'string',
        },
        {
          name: 'uri',
          type: 'string',
        },
      ],
    },
    {
      name: 'burnForSol',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'parentMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'parentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'childrenMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'burnForToken',
      accounts: [
        {
          name: 'currentOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'parentMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'parentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'childTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'childrenMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'childrenMetadata',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'reversible',
            type: 'bool',
          },
          {
            name: 'child',
            type: 'publicKey',
          },
          {
            name: 'childType',
            type: {
              defined: 'ChildType',
            },
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'parentMetadata',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'parent',
            type: 'publicKey',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'ChildType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'SOL',
          },
          {
            name: 'SPL',
          },
          {
            name: 'NFT',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidMetadataBump',
      msg: 'The bump passed in does not match the bump in the PDA',
    },
    {
      code: 6001,
      name: 'InvalidAuthority',
      msg: 'Current owner is not the authority of the parent token',
    },
    {
      code: 6002,
      name: 'InvalidExtractAttempt',
      msg: 'Only Reversible Synthetic Tokens can be extracted',
    },
    {
      code: 6003,
      name: 'InvalidBurnType',
      msg: 'Wrong type of burn instruction for the token',
    },
  ],
}
